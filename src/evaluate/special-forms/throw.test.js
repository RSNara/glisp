import test from 'ava';
import * as GLISP from '../../index';

test('should throw an error if throw is called with no arguments', (t) => {
  const shouldDie = () => run({}, '(throw)');
  const error = t.throws(shouldDie);

  [/exactly/i, /one/i, /arg/i].forEach((regex) => {
    t.regex(error.message, regex);
  });
});

test('should throw an error if throw is called with a non-error', (t) => {
  const shouldDie = () => run({}, '(throw 1)');
  const error = t.throws(shouldDie);

  [/throw/i, /object/i, /expect/i, /error/i, /instance/i].forEach((regex) => {
    t.regex(error.message, regex);
  });
});

test('should throw the passed in error', (t) => {
  const shouldDie = () => run({}, '(throw (js/Error "One two three!"))');
  const error = t.throws(shouldDie);

  t.is(error.message, 'One two three!');
});

function run(env, code) {
  return GLISP.evaluate(env, GLISP.parse(code));
}
