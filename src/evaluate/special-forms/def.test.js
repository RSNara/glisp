import test from 'ava';
import * as M from 'mathjs';
import { parse, evaluate } from '../../index';

test('should define a new variable in the current scope', (t) => {
  const env = {};
  run(env, `
    (def age 21)
  `);

  t.truthy(M.equal(env[Symbol.for('age')], 21));
});

test('should return the newly defined variable', (t) => {
  const env = {};
  const result = run(env, `
    (def age 21)
  `);

  t.is(env[Symbol.for('age')], result);
});

test('should only alter the current env', (t) => {
  const parentEnvironment = {};
  const env = Object.create(parentEnvironment);
  run(env, `
    (def age 21)
  `);

  t.is(Reflect.ownKeys(env).length, 1);
  t.is(Reflect.ownKeys(parentEnvironment).length, 0);
});

test('should allow variables to be redefined', (t) => {
  const env = {};
  run(env, `
    (do (def age 21) (def age 22))
  `);

  t.truthy(M.equal(env[Symbol.for('age')].toString(), 22));
});

function run(env, code) {
  return evaluate(env, parse(code));
}
