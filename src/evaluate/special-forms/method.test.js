import test from 'ava';
import * as td from 'testdouble';
import * as I from 'immutable';
import * as M from 'mathjs';
import { parse, evaluate } from '../../index';

const bignumber = (x) => M.bignumber(x);

test('should execute method calls with 0 arguments', (assert) => {
  const symbol = 'test';
  const env = {
    [Symbol.for('Util')]: {
      noop: () => symbol,
    },
  };

  const result = run(env, `
    (.noop Util)
  `);

  assert.is(result, symbol);
});

test('should execute method calls on global objects', () => {
  td.replace(console, 'log');
  run({}, `
    (.log js/console "Hi!")
  `);

  td.verify(console.log('Hi!'));
});

test('should execute method calls on Set instances', (assert) => {
  const result = run({}, `
    (.add #{1 2 3 4} 5)
  `);

  assert.truthy(I.is(result, I.Set.of(1, 2, 3, 4, 5).map(bignumber)));
});

test('should execute method calls on Map instances', (assert) => {
  const result = run({}, `
    (.getIn {1 2, 3 {1 3}} [3 1])
  `);

  assert.truthy(M.equal(result, 3));
});

test('should execute method calls on Stack instances', (assert) => {
  const result = run({}, `
    (.peek (quote (1 2 3)))
  `);

  assert.truthy(M.equal(result, 1));
});

test('should execute method calls on List instances', (assert) => {
  const result = run({}, `
    (.clear [1 2 3 4 (quote ()) {} #{}])
  `);

  assert.truthy(I.is(result, I.List()));
});

test('should throw if the object is undefined', (assert) => {
  const env = {
    [Symbol.for('object')]: undefined,
  };
  assert.throws(() => run(env, `
    (.clear object)
  `));
});

test('should throw if the object is null', (assert) => {
  const env = {
    [Symbol.for('object')]: null,
  };
  assert.throws(() => run(env, `
    (.clear object)
  `));
});

test('should throw if called with less than 2 arguments', (assert) => {
  assert.throws(() => run({}, `
    (.clear)
  `));
});

test('should throw if method name evaluates to a non-function', (assert) => {
  const env = {
    [Symbol.for('object')]: {},
  };

  assert.throws(() => run(env, `
    (.clear object)
  `));
});

test('should evaluate all arguments before passing them into the call', (assert) => {
  const result = run({}, `
    (let [first-name "Ramanpreet"
          last-name "Nara"]
      (.push [] first-name last-name))
  `);

  assert.truthy(I.is(result, I.List.of('Ramanpreet', 'Nara')));
});

function run(env, code) {
  return evaluate(env, parse(code));
}
