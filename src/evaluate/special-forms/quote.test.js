import test from 'ava';
import * as I from 'immutable';
import * as M from 'mathjs';
import * as R from 'ramda';
import { parse, evaluate, RootEnv } from '../../index';

const bignumber = (x) => M.bignumber(x);
const symbol = (x) => Symbol.for(x);

test('should prevent symbol evaluation', (assert) => {
  const result = run({}, `
    (quote a)
  `);

  assert.is(result, Symbol.for('a'));
});

test('should prevent a Stack from being executed', (assert) => {
  const result = run({}, `
    (quote (1 2 3 4))
  `);

  assert.truthy(I.is(result, R.map(bignumber, I.Stack.of(1, 2, 3, 4))));
});

test('should prevent any elements inside a Stack from being evaluated', (assert) => {
  const result = run({}, `
    (quote (a b c d))
  `);

  assert.truthy(I.is(result, R.map(symbol, I.Stack.of('a', 'b', 'c', 'd'))));
});

test('should prevent any elements inside a Set from being evaluated', (assert) => {
  const result = run({}, `
    (quote #{a b c d})
  `);

  assert.truthy(I.is(result, R.map(symbol, I.Set.of('a', 'b', 'c', 'd'))));
});

test('should prevent any elements inside a Map from being evaluated', (assert) => {
  const result = run({}, `
    (quote {a b c d})
  `);

  const expected = I.Map.of(...['a', 'b', 'c', 'd'].map(symbol));
  assert.truthy(I.is(result, expected));
});

test('should prevent any elements inside a List from being evaluated', (assert) => {
  const result = run({}, `
    (quote [a b c d])
  `);

  assert.truthy(I.is(result, R.map(symbol, I.List.of('a', 'b', 'c', 'd'))));
});

test('should no execute any nested Stacks', (assert) => {
  const result = run({}, `
    (quote ((1 2) (a)))
  `);

  const expected = I.Stack.of(I.Stack.of(bignumber(1), bignumber(2)), I.Stack.of(symbol('a')));
  assert.truthy(I.is(result, expected));
});

test('should allow for symbols to be unquoted', (assert) => {
  const result = run({}, `
    (let [a 1]
      (quote (a (unquote a))))
  `);

  assert.truthy(I.is(result, I.Stack.of(symbol('a'), bignumber(1))));
});

test('should allow nested Stacks to be evaluated via unquote', (assert) => {
  const result = run(RootEnv, `
    (let [a 1
          b 2]
      (quote (sum (unquote (+ a b)))))
  `);

  assert.truthy(I.is(result, I.Stack.of(symbol('sum'), bignumber(3))));
});

test('should allow unquotes within quotes within unquotes within quotes', (assert) => {
  const result = run(RootEnv, `
    (let [a 1]
      (quote
        (answer
          (unquote
            (let [b 2]
              (quote
                (sum
                  (unquote (+ a b)))))))))
  `);

  const expected = I.Stack.of(symbol('answer'), I.Stack.of(symbol('sum'), bignumber(3)));
  assert.truthy(I.is(result, expected));
});

test('should allow unquotes within Map keys', (assert) => {
  const result = run({}, `
    (let [a 1
          b 2]
      (quote {(unquote a) a
              (unquote b) b}))
  `);

  const expected = I.Map.of(bignumber(1), symbol('a'), bignumber(2), symbol('b'));
  assert.truthy(I.is(result, expected));
});

test('should allow unquotes within Map values', (assert) => {
  const result = run({}, `
    (let [a 1
          b 2]
      (quote {a (unquote a)
              b (unquote b)}))
  `);

  const expected = I.Map.of(symbol('a'), bignumber(1), symbol('b'), bignumber(2));
  assert.truthy(I.is(result, expected));
});

test('should allow unquotes within Sets', (assert) => {
  const result = run({}, `
    (let [a 1]
      (quote #{a (unquote a)}))
  `);

  assert.truthy(I.is(result, I.Set.of(symbol('a'), bignumber(1))));
});

test('should allow unquotes within Lists', (assert) => {
  const result = run({}, `
    (let [a 1]
      (quote [a (unquote a)]))
  `);

  assert.truthy(I.is(result, I.List.of(symbol('a'), bignumber(1))));
});

function run(env, code) {
  return evaluate(env, parse(code));
}
