import test from 'ava';
import tokenize from './tokenize';

test('should tokenize empty lists', (assert) => {
  const tokens = tokenize('()');
  assert.deepEqual(tokens, ['(', ')']);
});

test('should tokenize lists with numbers', (assert) => {
  const tokens = tokenize('(1 2 3)');
  assert.deepEqual(tokens, ['(', '1', '2', '3', ')']);
});

test('should tokenize nested lists', (assert) => {
  const tokens = tokenize('((1 (1 2)) 4)');
  assert.deepEqual(tokens, ['(', '(', '1', '(', '1', '2', ')', ')', '4', ')']);
});

test('should tokenize map literals', (assert) => {
  const tokens = tokenize('{}');
  assert.deepEqual(tokens, ['{', '}']);
});

test('should tokenize nested maps and lists', (assert) => {
  const tokens = tokenize('{(1 2) {}}');
  assert.deepEqual(tokens, ['{', '(', '1', '2', ')', '{', '}', '}']);
});

test('should tokenize numbers directly adjacent to {', (assert) => {
  const tokens = tokenize('{1 2 { 3 4{{');
  assert.deepEqual(tokens, ['{', '1', '2', '{', '3', '4', '{', '{']);
});

test('should split on }', (assert) => {
  const tokens = tokenize('}2}}}4444}$');
  assert.deepEqual(tokens, ['}', '2', '}', '}', '}', '4444', '}', '$']);
});

test('should tokenize sets', (assert) => {
  const tokens = tokenize('#{1 2 3 4}');
  assert.deepEqual(tokens, ['#{', '1', '2', '3', '4', '}']);
});

test('should tokenize a mixture of maps and sets', (assert) => {
  const tokens = tokenize('#{{1 2} #{4}}');
  assert.deepEqual(tokens, ['#{', '{', '1', '2', '}', '#{', '4', '}', '}']);
});

test('should tokenize numbers adjacent to map and set literals', (assert) => {
  const tokens = tokenize('4#{{1{$}');
  assert.deepEqual(tokens, ['4', '#{', '{', '1', '{', '$', '}']);
});

test('should tokenize a mixture of maps, sets, and lists', (assert) => {
  const tokens = tokenize('){()#{()1}}');
  assert.deepEqual(tokens, [')', '{', '(', ')', '#{', '(', ')', '1', '}', '}']);
});

test('should tokenize \'#\' when beside \'(\'', (assert) => {
  const tokens = tokenize('#(');
  assert.deepEqual(tokens, ['#', '(']);
});

test('should treat \',\' as whitepsaces', (assert) => {
  const tokens = tokenize('(1,2,{})');
  assert.deepEqual(tokens, ['(', '1', '2', '{', '}', ')']);
});

test('should turn whitespace into an empty array', (assert) => {
  const tokens = tokenize('\n\t   \t\n');
  assert.deepEqual(tokens, []);
});

test('should tokenize \'&\' charcters', (assert) => {
  const tokens = tokenize('(&)');
  assert.deepEqual(tokens, ['(', '&', ')']);
});

test('should tokenize \'&\' beside spaces', (assert) => {
  const tokens = tokenize(' & ');
  assert.deepEqual(tokens, ['&']);
});

test('should strip comments from strings', (assert) => {
  const tokens = tokenize(`
    (+ 1 1) ;; 2
  `);
  assert.deepEqual(tokens, ['(', '+', '1', '1', ')']);
});

test('should tokenize a comment as an empty array', (assert) => {
  const tokens = tokenize('; I am a comment!');
  assert.deepEqual(tokens, []);
});

test('should strip comments in multiple lines', (assert) => {
  const tokens = tokenize(`
    ;; This is a comment!
    ;; This is another comment!
    + ;; This is the add function!
    ;; This is the final comment!
  `);

  assert.deepEqual(tokens, ['+']);
});

test('should not tokenize strings within comments', (assert) => {
  const tokens = tokenize(`
    ; "I'm a string!"
  `);

  assert.deepEqual(tokens, []);
});

test('should not tokenize Set literals within comments', (assert) => {
  const tokens = tokenize(`
    ; #{1 2}
    ;; This is another comment!
    ; #{1} #{2}
    #{}
  `);

  assert.deepEqual(tokens, ['#{', '}']);
});

test('should not tokenize Map literals within comments', (assert) => {
  const tokens = tokenize(`
    ; {1 2 3 4 5 6}
    ;; This is another comment!
    ; {1} {2}
    {}
  `);

  assert.deepEqual(tokens, ['{', '}']);
});

test('should not tokenize List literals within comments', (assert) => {
  const tokens = tokenize(`
    ; [1 2 3 4 5 6]
    ;; This is another comment!
    ; [1] [2]
    [1 23 4]
  `);

  assert.deepEqual(tokens, ['[', '1', '23', '4', ']']);
});

test('should not tokenize Stack literals within comments', (assert) => {
  const tokens = tokenize(`
    ;; This is my super special comment
    (One two three)  ;; This is another super special comment!
    ;; (one two three four five six seven)
  `);

  assert.deepEqual(tokens, ['(', 'One', 'two', 'three', ')']);
});

test('should not tokenize comments within comments', (assert) => {
  const tokens = tokenize(`
    1 ;; 2 ;; 3 ;; 4
  `);

  assert.deepEqual(tokens, ['1']);
});

test('should tokenize single line strings', (assert) => {
  const tokens = tokenize('"This is a string!"');
  assert.deepEqual(tokens, ['"This is a string!"']);
});

test('should tokenize multiline strings correctly', (assert) => {
  const tokens = tokenize(`
    1 2
    "Super special awesome
    Multiline String" ;; 4 spaces
  `);
  assert.deepEqual(tokens, ['1', '2', '"Super special awesome\n    Multiline String"']);
});

test('should tokenize strings with escaped instances of "', (assert) => {
  const tokens = tokenize('"I am a \\"frog\\", you fish."');
  assert.deepEqual(tokens, ['"I am a "frog", you fish."']);
});


test('should not tokenize Map literals within strings', (assert) => {
  const tokens = tokenize(`
    "This is a map: {1 2}"
  `);
  assert.deepEqual(tokens, ['"This is a map: {1 2}"']);
});

test('should not tokenize Set literals within strings', (assert) => {
  const tokens = tokenize(`
    "This is a set: #{1 2}"
  `);
  assert.deepEqual(tokens, ['"This is a set: #{1 2}"']);
});

test('should not tokenize List literals within strings', (assert) => {
  const tokens = tokenize(`
    "This is a List: [[1 2] [2]]"
  `);
  assert.deepEqual(tokens, ['"This is a List: [[1 2] [2]]"']);
});

test('should not tokenize Stack literals within strings', (assert) => {
  const tokens = tokenize(`
    "This is an executable form: (+ 1 2 3)"
  `);
  assert.deepEqual(tokens, ['"This is an executable form: (+ 1 2 3)"']);
});

test('should not tokenize comments within strings', (assert) => {
  const tokens = tokenize(`
    "This is a comment within a string: ;; I'm a comment!"
  `);
  assert.deepEqual(tokens, ['"This is a comment within a string: ;; I\'m a comment!"']);
});
