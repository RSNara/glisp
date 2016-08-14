import test from 'ava';
import * as GLISP from '../index';
import * as I from 'immutable';
import * as M from 'mathjs';

const bignumber = (x) => M.bignumber(x);

test('should enable the implementation of rest', (assert) => {
  const rest = run({}, '(fn [[x & args]] args)');
  const list = I.List.of(1, 2, 3, 4, 5);
  assert.truthy(I.is(rest(list), list.rest()));
});

test('should enable the implementation of first', (assert) => {
  const first = run({}, '(fn [[x]] x)');
  const list = I.List.of(1, 2, 3, 4, 5);
  assert.truthy(I.is(first(list), list.first()));
});

test('should destructure elements from sets in the correct order', (assert) => {
  const list = run({}, `
    (let [[one two three] (quote (1 2 3))]
      [1 2 3])
  `);

  const expectedList = I.List.of(1, 2, 3).map(bignumber);
  assert.truthy(I.is(list, expectedList));
});

function run(env, code) {
  return GLISP.evaluate(env, GLISP.parse(code));
}
