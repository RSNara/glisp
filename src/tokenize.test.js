import test from 'ava';
import tokenize from './tokenize';

test('should tokenize empty Stacks', (t) => {
  const tokens = tokenize('()');
  t.deepEqual(tokens, ['(', ')']);
});

test('should tokenize Stacks with numbers', (t) => {
  const tokens = tokenize('(1 2 3)');
  t.deepEqual(tokens, ['(', '1', '2', '3', ')']);
});

test('should tokenize nested Stacks', (t) => {
  const tokens = tokenize('((1 (1 2)) 4)');
  t.deepEqual(tokens, ['(', '(', '1', '(', '1', '2', ')', ')', '4', ')']);
});

test('should tokenize map literals', (t) => {
  const tokens = tokenize('{}');
  t.deepEqual(tokens, ['{', '}']);
});

test('should tokenize nested maps and Stacks', (t) => {
  const tokens = tokenize('{(1 2) {}}');
  t.deepEqual(tokens, ['{', '(', '1', '2', ')', '{', '}', '}']);
});

test('should tokenize numbers directly adjacent to {', (t) => {
  const tokens = tokenize('{1 2 { 3 4{{');
  t.deepEqual(tokens, ['{', '1', '2', '{', '3', '4', '{', '{']);
});

test('should split on }', (t) => {
  const tokens = tokenize('}2}}}4444}$');
  t.deepEqual(tokens, ['}', '2', '}', '}', '}', '4444', '}', '$']);
});

test('should tokenize sets', (t) => {
  const tokens = tokenize('#{1 2 3 4}');
  t.deepEqual(tokens, ['#{', '1', '2', '3', '4', '}']);
});

test('should tokenize a mixture of maps and sets', (t) => {
  const tokens = tokenize('#{{1 2} #{4}}');
  t.deepEqual(tokens, ['#{', '{', '1', '2', '}', '#{', '4', '}', '}']);
});

test('should tokenize numbers adjacent to map and set literals', (t) => {
  const tokens = tokenize('4#{{1{$}');
  t.deepEqual(tokens, ['4', '#{', '{', '1', '{', '$', '}']);
});

test('should tokenize a mixture of maps, sets, and lists', (t) => {
  const tokens = tokenize('){()#{()1}}');
  t.deepEqual(tokens, [')', '{', '(', ')', '#{', '(', ')', '1', '}', '}']);
});

test('should tokenize \'#\' when beside \'(\'', (t) => {
  const tokens = tokenize('#(');
  t.deepEqual(tokens, ['#(']);
});

test('should treat \',\' as whitepsaces', (t) => {
  const tokens = tokenize('(1,2,{})');
  t.deepEqual(tokens, ['(', '1', '2', '{', '}', ')']);
});

test('should turn whitespace into an empty array', (t) => {
  const tokens = tokenize('\n\t   \t\n');
  t.deepEqual(tokens, []);
});

test('should tokenize \'&\' charcters', (t) => {
  const tokens = tokenize('(&)');
  t.deepEqual(tokens, ['(', '&', ')']);
});

test('should tokenize \'&\' beside spaces', (t) => {
  const tokens = tokenize(' & ');
  t.deepEqual(tokens, ['&']);
});

test('should strip comments from strings', (t) => {
  const tokens = tokenize(`
    (+ 1 1) ;; 2
  `);
  t.deepEqual(tokens, ['(', '+', '1', '1', ')']);
});

test('should tokenize a comment as an empty array', (t) => {
  const tokens = tokenize('; I am a comment!');
  t.deepEqual(tokens, []);
});

test('should strip comments in multiple lines', (t) => {
  const tokens = tokenize(`
    ;; This is a comment!
    ;; This is another comment!
    + ;; This is the add function!
    ;; This is the final comment!
  `);

  t.deepEqual(tokens, ['+']);
});

test('should not tokenize strings within comments', (t) => {
  const tokens = tokenize(`
    ; "I'm a string!"
  `);

  t.deepEqual(tokens, []);
});

test('should not tokenize Set literals within comments', (t) => {
  const tokens = tokenize(`
    ; #{1 2}
    ;; This is another comment!
    ; #{1} #{2}
    #{}
  `);

  t.deepEqual(tokens, ['#{', '}']);
});

test('should not tokenize Map literals within comments', (t) => {
  const tokens = tokenize(`
    ; {1 2 3 4 5 6}
    ;; This is another comment!
    ; {1} {2}
    {}
  `);

  t.deepEqual(tokens, ['{', '}']);
});

test('should not tokenize List literals within comments', (t) => {
  const tokens = tokenize(`
    ; [1 2 3 4 5 6]
    ;; This is another comment!
    ; [1] [2]
    [1 23 4]
  `);

  t.deepEqual(tokens, ['[', '1', '23', '4', ']']);
});

test('should not tokenize Stack literals within comments', (t) => {
  const tokens = tokenize(`
    ;; This is my super special comment
    (One two three)  ;; This is another super special comment!
    ;; (one two three four five six seven)
  `);

  t.deepEqual(tokens, ['(', 'One', 'two', 'three', ')']);
});

test('should not tokenize comments within comments', (t) => {
  const tokens = tokenize(`
    1 ;; 2 ;; 3 ;; 4
  `);

  t.deepEqual(tokens, ['1']);
});

test('should tokenize single line strings', (t) => {
  const tokens = tokenize('"This is a string!"');
  t.deepEqual(tokens, ['"This is a string!"']);
});

test('should tokenize multiline strings correctly', (t) => {
  const tokens = tokenize(`
    1 2
    "Super special awesome
    Multiline String" ;; 4 spaces
  `);
  t.deepEqual(tokens, ['1', '2', '"Super special awesome\n    Multiline String"']);
});

test('should tokenize strings with escaped instances of "', (t) => {
  const tokens = tokenize('"I am a \\"frog\\", you fish."');
  t.deepEqual(tokens, ['"I am a "frog", you fish."']);
});


test('should not tokenize Map literals within strings', (t) => {
  const tokens = tokenize(`
    "This is a map: {1 2}"
  `);
  t.deepEqual(tokens, ['"This is a map: {1 2}"']);
});

test('should not tokenize Set literals within strings', (t) => {
  const tokens = tokenize(`
    "This is a set: #{1 2}"
  `);
  t.deepEqual(tokens, ['"This is a set: #{1 2}"']);
});

test('should not tokenize List literals within strings', (t) => {
  const tokens = tokenize(`
    "This is a List: [[1 2] [2]]"
  `);
  t.deepEqual(tokens, ['"This is a List: [[1 2] [2]]"']);
});

test('should not tokenize Stack literals within strings', (t) => {
  const tokens = tokenize(`
    "This is an executable form: (+ 1 2 3)"
  `);
  t.deepEqual(tokens, ['"This is an executable form: (+ 1 2 3)"']);
});

test('should not tokenize comments within strings', (t) => {
  const tokens = tokenize(`
    "This is a comment within a string: ;; I'm a comment!"
  `);
  t.deepEqual(tokens, ['"This is a comment within a string: ;; I\'m a comment!"']);
});

test('should tokenize List literals beside regular symbols', (t) => {
  const tokens = tokenize(`
    (defn id[x]x)
  `);
  t.deepEqual(tokens, ['(', 'defn', 'id', '[', 'x', ']', 'x', ')']);
});

test('should tokenize \'\\t\'', (t) => {
  const tokens = tokenize(`
    "I'm a horse\\t, duh."
  `);

  t.deepEqual(tokens, ['"I\'m a horse\t, duh."']);
});

test('should tokenize \'\\r\'', (t) => {
  const tokens = tokenize(`
    "I'm a horse\\r, duh."
  `);

  t.deepEqual(tokens, ['"I\'m a horse\r, duh."']);
});

test('should tokenize \'\\n\'', (t) => {
  const tokens = tokenize(`
    "I'm a horse\\n, duh."
  `);

  t.deepEqual(tokens, ['"I\'m a horse\n, duh."']);
});

test('should tokenize \'\\\'', (t) => {
  const tokens = tokenize(`
    "I'm a horse\\\\n, duh."
  `);

  t.deepEqual(tokens, ['"I\'m a horse\\n, duh."']);
});

test('should tokenize \'\\\\\\\\', (t) => {
  const tokens = tokenize(`
    "I'm a horse\\\\\\\\, duh."
  `);

  t.deepEqual(tokens, ['"I\'m a horse\\\\, duh."']);
});

test('should tokenize \'\\"\'', (t) => {
  const tokens = tokenize(`
    "I'm a \\"horse\\", duh."
  `);

  t.deepEqual(tokens, ['"I\'m a "horse", duh."']);
});
