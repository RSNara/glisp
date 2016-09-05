import test from 'ava';
import createParenMap from './create-paren-map';

test('should work for ()', (t) => {
  const tokens = ['(', '2', '(', '3', ')', '(', '(', ')', ')', ')'];
  const lastIndex = tokens.length - 1;
  t.deepEqual(createParenMap(tokens), {
    0: lastIndex,
    2: 4,
    5: lastIndex - 1,
    6: lastIndex - 2,
  });
});

test('should work for {} and ()', (t) => {
  const tokens = ['(', '2', '{', '3', '}', '(', '(', ')', ')', ')'];
  const lastIndex = tokens.length - 1;
  t.deepEqual(createParenMap(tokens), {
    0: lastIndex,
    2: 4,
    5: lastIndex - 1,
    6: lastIndex - 2,
  });
});

test('should work for {}, (), and []', (t) => {
  const tokens = ['(', '2', '{', '3', '}', '(', '[', ']', ')', ')'];
  const lastIndex = tokens.length - 1;
  t.deepEqual(createParenMap(tokens), {
    0: lastIndex,
    2: 4,
    5: lastIndex - 1,
    6: lastIndex - 2,
  });
});

test('should work for {}, (), [], and #{}', (t) => {
  const tokens = ['(', '2', '{', '3', '}', '#{', '[', ']', '}', ')'];
  const lastIndex = tokens.length - 1;
  t.deepEqual(createParenMap(tokens), {
    0: lastIndex,
    2: 4,
    5: lastIndex - 1,
    6: lastIndex - 2,
  });
});

test('should throw when a paren is unclosed', (t) => {
  const tokens = ['[', '1', '2', '#{', '}'];
  t.throws(() => createParenMap(tokens));
});

test('should throw when closing parens overlap', (t) => {
  const tokens = ['[', '1', '2', '#{', ']', '}'];
  t.throws(() => createParenMap(tokens));
});

test('should throw when an ending paren is encountered before a closing paren', (t) => {
  const tokens = ['}', '1', '2', '#{', '}'];
  t.throws(() => createParenMap(tokens));
});

test('should throw when an excess ending paren is detected at the end', (t) => {
  const tokens = ['{', '}', '}'];
  t.throws(() => createParenMap(tokens));
});

test('should throw when an excess starting paren is detected at the end', (t) => {
  const tokens = ['{', '}', '{'];
  t.throws(() => createParenMap(tokens));
});
