import test from 'ava';
import * as I from 'immutable';
import { parse, evaluate } from '../index';

test('should throw an error, if one tries to access an object not on global/window', (t) => {
  t.throws(() => run({}, `
    js/horse-js-like-no-tomorrow
  `));
});

test('should be able to access global objects', (t) => {
  const result = run({}, 'js/process');
  t.is(result, process);
});

test('should not parse () as an empty Stack', (t) => {
  const result = run({}, '()');
  t.truthy(I.is(result, I.Stack()));
});

test('should throw an error, if a variable not in the scope chain is dereferenced', (t) => {
  const enviornment = {};
  t.throws(() => run(enviornment, '='));
});

function run(env, code) {
  return evaluate(env, parse(code));
}
