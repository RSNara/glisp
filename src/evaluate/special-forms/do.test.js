import * as M from 'mathjs';
import test from 'ava';
import { parse, evaluate } from '../../index';

test('should return the result of the final expression', (t) => {
  const environment = {};
  const result = evaluate(environment, parse(`
    (do 1 2 3 4 5)
  `));

  t.is(result.toString(), '5');
});

test('should execute all expressions', (t) => {
  const environment = {};
  const getVariable = (name) => environment[Symbol.for(name)];
  evaluate(environment, parse(`
    (do
      (def one 1)
      (def two 2)
      (def three 3))
  `));

  t.is(getVariable('one').toString(), '1');
  t.is(getVariable('two').toString(), '2');
  t.is(getVariable('three').toString(), '3');
});

test('should execute all expressions serially from top to bottom', (t) => {
  const environment = {};
  const getVariable = (name) => environment[Symbol.for(name)];
  evaluate(environment, parse(`
    (do
      (def one 1)
      (def one 2)
      (def one 3))
  `));

  t.is(getVariable('one').toString(), '3');
});

test('should return undefined when called with an empty body', (t) => {
  const result = evaluate({}, parse(`
    (do)
  `));

  t.is(result, undefined);
});

test('should allow user to specify intent via a string', (t) => {
  const result = evaluate({}, parse(`
    (do
      "This is for not performing side effects!"
      3)
  `));

  t.truthy(M.equal(result, 3));
});
