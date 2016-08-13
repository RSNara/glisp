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
