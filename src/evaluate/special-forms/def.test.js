import test from 'ava';
import * as M from 'mathjs';
import { parse, evaluate } from '../../index';

test('should define a new variable in the current scope', (assert) => {
  const env = {};
  run(env, `
    (def age 21)
  `);

  assert.truthy(M.equal(env[Symbol.for('age')], 21));
});

test('should return the newly defined variable', (assert) => {
  const env = {};
  const result = run(env, `
    (def age 21)
  `);

  assert.is(env[Symbol.for('age')], result);
});

test('should only alter the current env', (assert) => {
  const parentEnvironment = {};
  const env = Object.create(parentEnvironment);
  run(env, `
    (def age 21)
  `);

  assert.is(Reflect.ownKeys(env).length, 1);
  assert.is(Reflect.ownKeys(parentEnvironment).length, 0);
});

test('should allow variables to be redefined', (assert) => {
  const env = {};
  run(env, `
    (do (def age 21) (def age 22))
  `);

  assert.truthy(M.equal(env[Symbol.for('age')].toString(), 22));
});

test('should throw an error if one tries to dereference an undefined symbol', (assert) => {
  const enviornment = {};
  assert.throws(() => run(enviornment, '='));
});

function run(env, code) {
  return evaluate(env, parse(code));
}
