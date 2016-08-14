import test from 'ava';
import * as I from 'immutable';
import { parse, evaluate } from '../index';

test('should throw an error, if one tries to access an object not on global/window', (assert) => {
  assert.throws(() => run({}, `
    js/horse-js-like-no-tomorrow
  `));
});

test('should be able to access global objects', (assert) => {
  const result = run({}, 'js/process');
  assert.is(result, process);
});

test('should not parse () as an empty Stack', (assert) => {
  const result = run({}, '()');
  assert.truthy(I.is(result, I.Stack()));
});

test('should throw an error, if a variable not in the scope chain is dereferenced', (assert) => {
  const enviornment = {};
  assert.throws(() => run(enviornment, '='));
});

function run(env, code) {
  return evaluate(env, parse(code));
}
