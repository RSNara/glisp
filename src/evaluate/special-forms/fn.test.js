import test from 'ava';
import * as I from 'immutable';
import * as R from 'ramda';
import { parse, evaluate } from '../../index';

test('should return a function', (t) => {
  const result = run({}, `
    (fn [] 1)
  `);

  t.truthy(R.is(Function, result));
});

test('should throw an error if argument list is a Stack', (t) => {
  t.throws(() => run({}, `
    (fn () 1)
  `));
});

test('should throw an error if there is no argument list', (t) => {
  t.throws(() => run({}, `
    (fn)
  `));
});

test('should throw an error if called with fewer than the expected number of args', (t) => {
  t.throws(() => run({}, `
    ((fn [a]))
  `));
});

test('should throw an error if called with more than the expected number of args', (t) => {
  t.throws(() => run({}, `
    ((fn [a]) 1 2)
  `));
});

test('should not throw an error if variadic and called with more args than expected', (t) => {
  t.notThrows(() => run({}, `
    ((fn [a & rest]) 1 2 4 5 6 7 8)
  `));
});

test('should throw an error if variadic and called with fewer args than expected', (t) => {
  t.throws(() => run({}, `
    ((fn [a & rest]))
  `));
});

test('should return the result of the last form in its body', (t) => {
  const result = run({}, `
    ((fn [] 1 2 3 4 5))
  `);

  t.is(result, 5);
});

test('should return \'undefined\' if there are no forms in its body', (t) => {
  const result = run({}, `
    ((fn []))
  `);

  t.is(result, undefined);
});

test('should support full argument destructuring', (t) => {
  const args = [1, 2, 3, 4, 5, 6];
  const result = run({}, `
    ((fn [& args] args) ${args.join(' ')})
  `);

  t.truthy(I.is(result, I.Seq(args)));
});

test('should work with the identity function', (t) => {
  const result = run({}, `
    ((fn [x] x) 1)
  `);

  t.truthy(I.is(1, result));
});

test('should support partial argument destructuring', (t) => {
  const args = [1, 2, 3, 4, 5, 6];
  const result = run({}, `
    ((fn [a b c & rest] rest) ${args.join(' ')})
  `);

  t.truthy(I.is(result, I.Seq(args.slice(3))));
});

test('can construct a List from arguments provided', (t) => {
  const result = run({}, `
    ((fn [a b c] [a b c]) 1 2 3)
  `);

  t.truthy(I.is(result, I.List.of(1, 2, 3)));
});

test('can construct a Set from arguments provided', (t) => {
  const result = run({}, `
    ((fn [a b c] #{a b c}) 1 2 3)
  `);

  t.truthy(I.is(result, I.Set.of(1, 2, 3)));
});

test('can construct a Stack from arguments provided', (t) => {
  const result = run({}, `
    ((fn [a b c] (quote ((unquote a) (unquote b) (unquote c)))) 1 2 3)
  `);

  t.truthy(I.is(result, I.Stack.of(1, 2, 3)));
});

test('should treat rest as a destructuring form', (t) => {
  const args = [1, 2, 3, 4, 5, 6];
  const result = run({}, `
    ((fn [a & [b & [c & [d & [e & [f]]]]]] [a b c d e f]) ${args.join(' ')})
  `);

  t.truthy(I.is(result, I.List(args)));
});

test('should collect remaining arguments in the inner-most destructuring form', (t) => {
  const args = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const result = run({}, `
    ((fn [a & [b & [c & [d & [e & rest]]]]] rest) ${args.join(' ')})
  `);

  t.truthy(I.is(result, I.Seq.of(6, 7, 8, 9, 10)));
});

test('should default rest to an empty Seq if there are no extra arguments', (t) => {
  const result = run({}, `
    ((fn [a & rest] rest) 1)
  `);

  t.truthy(I.is(I.Seq(), result));
});

test('should default rest to an empty Seq if there are no arguments', (t) => {
  const result = run({}, `
    ((fn [& rest] rest))
  `);

  t.truthy(I.is(I.Seq(), result));
});

test('should default elements to undefined if they cannot be destructured', (t) => {
  const result = run({}, `
    ((fn [a & [b & rest]] [a b rest]) 1)
  `);

  const expected = I.List.of(1, undefined, I.Seq());
  t.truthy(I.is(result, expected));
});

test('should accept falsey arguments', (t) => {
  const result = run({}, `
    ((fn [x] x) false)
  `);

  t.is(result, false);
});

function run(env, code) {
  return evaluate(env, parse(code));
}
