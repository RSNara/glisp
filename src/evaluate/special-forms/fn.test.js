import test from 'ava';
import * as I from 'immutable';
import * as M from 'mathjs';
import * as R from 'ramda';
import { parse, evaluate } from '../../index';

const bignumber = (x) => M.bignumber(x);

test('should return a function', (assert) => {
  const result = run({}, `
    (fn [] 1)
  `);

  assert.truthy(R.is(Function, result));
});

test('should throw an error if argument list is a Stack', (assert) => {
  assert.throws(() => run({}, `
    (fn () 1)
  `));
});

test('should throw an error if there is no argument list', (assert) => {
  assert.throws(() => run({}, `
    (fn)
  `));
});

test('should throw an error if called with fewer than the expected number of args', (assert) => {
  assert.throws(() => run({}, `
    ((fn [a]))
  `));
});

test('should throw an error if called with more than the expected number of args', (assert) => {
  assert.throws(() => run({}, `
    ((fn [a]) 1 2)
  `));
});

test('should not throw an error if variadic and called with more args than expected', (assert) => {
  assert.notThrows(() => run({}, `
    ((fn [a & rest]) 1 2 4 5 6 7 8)
  `));
});

test('should throw an error if variadic and called with fewer args than expected', (assert) => {
  assert.throws(() => run({}, `
    ((fn [a & rest]))
  `));
});

test('should return the result of the last form in its body', (assert) => {
  const result = run({}, `
    ((fn [] 1 2 3 4 5))
  `);

  assert.truthy(M.equal(result, 5));
});

test('should return \'undefined\' if there are no forms in its body', (assert) => {
  const result = run({}, `
    ((fn []))
  `);

  assert.is(result, undefined);
});

test('should support full argument destructuring', (assert) => {
  const args = [1, 2, 3, 4, 5, 6];
  const result = run({}, `
    ((fn [& args] args) ${args.join(' ')})
  `);

  assert.truthy(I.is(result, R.map(bignumber, I.Seq(args))));
});

test('should work with the identity function', (assert) => {
  const result = run({}, `
    ((fn [x] x) 1)
  `);

  assert.truthy(I.is(bignumber(1), result));
});

test('should support partial argument destructuring', (assert) => {
  const args = [1, 2, 3, 4, 5, 6];
  const result = run({}, `
    ((fn [a b c & rest] rest) ${args.join(' ')})
  `);

  assert.truthy(I.is(result, R.map(bignumber, I.Seq(args.slice(3)))));
});

test('can construct a List from arguments provided', (assert) => {
  const result = run({}, `
    ((fn [a b c] [a b c]) 1 2 3)
  `);

  assert.truthy(I.is(result, R.map(bignumber, I.List.of(1, 2, 3))));
});

test('can construct a Set from arguments provided', (assert) => {
  const result = run({}, `
    ((fn [a b c] #{a b c}) 1 2 3)
  `);

  assert.truthy(I.is(result, R.map(bignumber, I.Set.of(1, 2, 3))));
});

test('can construct a Stack from arguments provided', (assert) => {
  const result = run({}, `
    ((fn [a b c] (quote ((unquote a) (unquote b) (unquote c)))) 1 2 3)
  `);

  assert.truthy(I.is(result, R.map(bignumber, I.Stack.of(1, 2, 3))));
});

test('should treat rest as a destructuring form', (assert) => {
  const args = [1, 2, 3, 4, 5, 6];
  const result = run({}, `
    ((fn [a & [b & [c & [d & [e & [f]]]]]] [a b c d e f]) ${args.join(' ')})
  `);

  assert.truthy(I.is(result, R.map(bignumber, I.List(args))));
});

test('should collect remaining arguments in the inner-most destructuring form', (assert) => {
  const args = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const result = run({}, `
    ((fn [a & [b & [c & [d & [e & rest]]]]] rest) ${args.join(' ')})
  `);

  assert.truthy(I.is(result, R.map(bignumber, I.Seq.of(6, 7, 8, 9, 10))));
});

test('should default rest to an empty Seq if there are no extra arguments', (assert) => {
  const result = run({}, `
    ((fn [a & rest] rest) 1)
  `);

  assert.truthy(I.is(I.Seq(), result));
});

test('should default rest to an empty Seq if there are no arguments', (assert) => {
  const result = run({}, `
    ((fn [& rest] rest))
  `);

  assert.truthy(I.is(I.Seq(), result));
});

test('should default elements to undefined if they cannot be destructured', (assert) => {
  const result = run({}, `
    ((fn [a & [b & rest]] [a b rest]) 1)
  `);

  const expected = I.List.of(bignumber(1), undefined, I.Seq());
  assert.truthy(I.is(result, expected));
});

test('should accept falsey arguments', (assert) => {
  const result = run({}, `
    ((fn [x] x) false)
  `);

  assert.is(result, false);
});

function run(env, code) {
  return evaluate(env, parse(code));
}
