import test from 'ava';
import { parse, evaluate } from '../../index';

test('should return the result of the final expression', (assert) => {
  const environment = {};
  const result = evaluate(environment, parse(`
    (do 1 2 3 4 5)
  `));

  assert.is(result.toString(), '5');
});

test('should execute all expressions', (assert) => {
  const environment = {};
  const getVariable = (name) => environment[Symbol.for(name)];
  evaluate(environment, parse(`
    (do
      (def one 1)
      (def two 2)
      (def three 3))
  `));

  assert.is(getVariable('one').toString(), '1');
  assert.is(getVariable('two').toString(), '2');
  assert.is(getVariable('three').toString(), '3');
});

test('should execute all expressions serially from top to bottom', (assert) => {
  const environment = {};
  const getVariable = (name) => environment[Symbol.for(name)];
  evaluate(environment, parse(`
    (do
      (def one 1)
      (def one 2)
      (def one 3))
  `));

  assert.is(getVariable('one').toString(), '3');
});

test('should return undefined when called with an empty body', (assert) => {
  const result = evaluate({}, parse(`
    (do)
  `));

  assert.is(result, undefined);
});
