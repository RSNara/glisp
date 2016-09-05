import test from 'ava';
import * as td from 'testdouble';
import * as I from 'immutable';
import { parse, evaluate } from '../../index';

test('should execute method calls with 0 arguments', (t) => {
  const symbol = 'test';
  const env = {
    [Symbol.for('Util')]: {
      noop: () => symbol,
    },
  };

  const result = run(env, `
    (.noop Util)
  `);

  t.is(result, symbol);
});

test('should execute method calls on global objects', () => {
  td.replace(console, 'log');
  run({}, `
    (.log js/console "Hi!")
  `);

  td.verify(console.log('Hi!'));
});

test('should execute method calls on Set instances', (t) => {
  const result = run({}, `
    (.add #{1 2 3 4} 5)
  `);

  t.truthy(I.is(result, I.Set.of(1, 2, 3, 4, 5)));
});

test('should execute method calls on Map instances', (t) => {
  const result = run({}, `
    (.getIn {1 2, 3 {1 3}} [3 1])
  `);

  t.is(result, 3);
});

test('should execute method calls on Stack instances', (t) => {
  const result = run({}, `
    (.peek (quote (1 2 3)))
  `);

  t.is(result, 1);
});

test('should execute method calls on List instances', (t) => {
  const result = run({}, `
    (.clear [1 2 3 4 (quote ()) {} #{}])
  `);

  t.truthy(I.is(result, I.List()));
});

test('should throw if the object is undefined', (t) => {
  const env = {
    [Symbol.for('object')]: undefined,
  };
  t.throws(() => run(env, `
    (.clear object)
  `));
});

test('should throw if the object is null', (t) => {
  const env = {
    [Symbol.for('object')]: null,
  };
  t.throws(() => run(env, `
    (.clear object)
  `));
});

test('should throw if called with less than 2 arguments', (t) => {
  t.throws(() => run({}, `
    (.clear)
  `));
});

test('should throw if method name evaluates to a non-function', (t) => {
  const env = {
    [Symbol.for('object')]: {},
  };

  t.throws(() => run(env, `
    (.clear object)
  `));
});

test('should evaluate all arguments before passing them into the call', (t) => {
  const result = run({}, `
    (let [first-name "Ramanpreet"
          last-name "Nara"]
      (.push [] first-name last-name))
  `);

  t.truthy(I.is(result, I.List.of('Ramanpreet', 'Nara')));
});

function run(env, code) {
  return evaluate(env, parse(code));
}
