import test from 'ava';
import * as M from 'mathjs';
import { parse, evaluate } from '../../index';

test('should define a new variable in the current scope', (assert) => {
  const environment = {};
  evaluate(environment, parse(`
    (def age 21)
  `));

  assert.truthy(M.equal(environment[Symbol.for('age')], 21));
});

test('should return the newly defined variable', (assert) => {
  const environment = {};
  const result = evaluate(environment, parse(`
    (def age 21)
  `));

  assert.is(environment[Symbol.for('age')], result);
});

test('should only alter the current environment', (assert) => {
  const parentEnvironment = {};
  const environment = Object.create(parentEnvironment);
  evaluate(environment, parse(`
    (def age 21)
  `));

  assert.is(Reflect.ownKeys(environment).length, 1);
  assert.is(Reflect.ownKeys(parentEnvironment).length, 0);
});

test('should allow variables to be redefined', (assert) => {
  const environment = {};
  evaluate(environment, parse(`
    (do (def age 21) (def age 22))
  `));

  assert.truthy(M.equal(environment[Symbol.for('age')].toString(), 22));
});

test('should return the value of the variable defined', (assert) => {
  const enviornment = {};
  const result = evaluate(enviornment, parse(`
    (def equal =)
  `));

  assert.is(result, enviornment[Symbol.for('equal')]);
});
