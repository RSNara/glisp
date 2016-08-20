import test from 'ava';
import * as GLISP from '../../index';

test('should throw an error if throw is called with no arguments', (assert) => {
  const shouldDie = () => run({}, '(throw)');
  const error = assert.throws(shouldDie);

  [/exactly/i, /one/i, /arg/i].forEach((regex) => {
    assert.regex(error.message, regex);
  });
});

test('should throw an error if throw is called with a non-error', (assert) => {
  const shouldDie = () => run({}, '(throw 1)');
  const error = assert.throws(shouldDie);

  [/throw/i, /object/i, /expect/i, /error/i, /instance/i].forEach((regex) => {
    assert.regex(error.message, regex);
  });
});

test('should throw the passed in error', (assert) => {
  const shouldDie = () => run({}, '(throw (js/Error "One two three!"))');
  const error = assert.throws(shouldDie);

  assert.is(error.message, 'One two three!');
});

function run(env, code) {
  return GLISP.evaluate(env, GLISP.parse(code));
}
