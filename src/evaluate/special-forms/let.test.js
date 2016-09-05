import test from 'ava';
import * as I from 'immutable';
import { parse, evaluate, RootEnv } from '../../index';

test('should allow local variable definitions', (t) => {
  const result = run({}, `
    (let [a 1] a)
  `);

  t.is(result, 1);
});

test('should not mutate the outer environment', (t) => {
  const environment = {};
  run(environment, `
    (let [a 1] a)
  `);

  t.is(Reflect.ownKeys(environment).length, 0);
});

test('should evaluate and return the last form', (t) => {
  const result = run({}, `
    (let [a 1] 2 a)
  `);

  t.is(result, 1);
});

test('should support multiple let bindings', (t) => {
  const result = run({}, `
    (let [a 1
          b 2
          c 3]
      [a b c])
  `);

  t.truthy(I.is(result, I.List.of(1, 2, 3)));
});

test('should support destructuring in let bindings', (t) => {
  const result = run({}, `
    (let [[x y] [1 2]] #{x y})
  `);

  t.truthy(I.is(result, I.Set.of(1, 2)));
});

test('should allow newer let bindings to depend on older ones', (t) => {
  const result = run(RootEnv, `
    (let [x 1
          y 2
          sum (+ x y)]
      sum)
  `);

  t.is(result, 3);
});

function run(environment, code) {
  return evaluate(environment, parse(code));
}
