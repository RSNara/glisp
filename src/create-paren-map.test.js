import test from 'ava';
import createParenMap from './create-paren-map';

test('should work for ()', (assert) => {
  const tokens = ['(', '2', '(', '3', ')', '(', '(', ')', ')', ')'];
  const lastIndex = tokens.length - 1;
  assert.deepEqual(createParenMap(tokens), {
    0: lastIndex,
    2: 4,
    5: lastIndex - 1,
    6: lastIndex - 2,
  });
});

test('should work for {} and ()', (assert) => {
  const tokens = ['(', '2', '{', '3', '}', '(', '(', ')', ')', ')'];
  const lastIndex = tokens.length - 1;
  assert.deepEqual(createParenMap(tokens), {
    0: lastIndex,
    2: 4,
    5: lastIndex - 1,
    6: lastIndex - 2,
  });
});

test('should work for {}, (), and []', (assert) => {
  const tokens = ['(', '2', '{', '3', '}', '(', '[', ']', ')', ')'];
  const lastIndex = tokens.length - 1;
  assert.deepEqual(createParenMap(tokens), {
    0: lastIndex,
    2: 4,
    5: lastIndex - 1,
    6: lastIndex - 2,
  });
});

test('should work for {}, (), [], and #{}', (assert) => {
  const tokens = ['(', '2', '{', '3', '}', '#{', '[', ']', '}', ')'];
  const lastIndex = tokens.length - 1;
  assert.deepEqual(createParenMap(tokens), {
    0: lastIndex,
    2: 4,
    5: lastIndex - 1,
    6: lastIndex - 2,
  });
});

test('should throw when a paren is unclosed', (assert) => {
  const tokens = ['[', '1', '2', '#{', '}'];
  assert.throws(() => createParenMap(tokens));
});

test('should throw when closing parens overlap', (assert) => {
  const tokens = ['[', '1', '2', '#{', ']', '}'];
  assert.throws(() => createParenMap(tokens));
});

test('should throw when an ending paren is encountered before a closing paren', (assert) => {
  const tokens = ['}', '1', '2', '#{', '}'];
  assert.throws(() => createParenMap(tokens));
});

test('should throw when an excess ending paren is detected at the end', (assert) => {
  const tokens = ['{', '}', '}'];
  assert.throws(() => createParenMap(tokens));
});

test('should throw when an excess starting paren is detected at the end', (assert) => {
  const tokens = ['{', '}', '{'];
  assert.throws(() => createParenMap(tokens));
});
