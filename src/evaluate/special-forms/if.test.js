import test from 'ava';
import * as Util from '../../util/index';
import { parse, evaluate, RootEnv } from '../../index';

test('should return the evaluation of the consequent if condition evaluates to true', (assert) => {
  const environment = Util.create(RootEnv, {
    [Symbol.for('condition')]: true,
    [Symbol.for('consequent')]: 'consequent',
    [Symbol.for('antecedent')]: 'antecedent',
  });

  const result = run(environment, `
    (if condition consequent antecedent)
  `);

  assert.is(result, 'consequent');
});

test('should return the evaluation of the antecedent if condition evaluates to false', (assert) => {
  const environment = Util.create(RootEnv, {
    [Symbol.for('condition')]: false,
    [Symbol.for('consequent')]: 'consequent',
    [Symbol.for('antecedent')]: 'antecedent',
  });

  const result = run(environment, `
    (if condition consequent antecedent)
  `);

  assert.is(result, 'antecedent');
});

test('should work if only the consequent is defined and the test evaluates to true', (assert) => {
  const result = run(RootEnv, `
    (if true "works!")
  `);

  assert.is(result, 'works!');
});

test('should work if only the consequent is defined and the test evaluates to false', (assert) => {
  const result = run(RootEnv, `
    (if false "works!")
  `);

  assert.is(result, undefined);
});

function run(env, code) {
  return evaluate(env, parse(code));
}
