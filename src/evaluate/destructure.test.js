import test from 'ava';
import * as GLISP from '../index';
import * as I from 'immutable';

test('should enable the implementation of rest', (t) => {
  const rest = run({}, '(fn [[x & args]] args)');
  const list = I.List.of(1, 2, 3, 4, 5);
  t.truthy(I.is(rest(list), list.rest()));
});

test('should enable the implementation of first', (t) => {
  const first = run({}, '(fn [[x]] x)');
  const list = I.List.of(1, 2, 3, 4, 5);
  t.truthy(I.is(first(list), list.first()));
});

test('should destructure elements from sets in the correct order', (t) => {
  const list = run({}, `
    (let [[one two three] (quote (1 2 3))]
      [1 2 3])
  `);

  const expectedList = I.List.of(1, 2, 3);
  t.truthy(I.is(list, expectedList));
});

function run(env, code) {
  return GLISP.evaluate(env, GLISP.parse(code));
}
