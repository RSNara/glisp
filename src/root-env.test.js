import test from 'ava';
import * as GLISP from './index';
import * as I from 'immutable';

test('or should work on more than one arg', (t) => {
  const result = run(GLISP.RootEnv, `
    (or false "" false false false true)
  `);

  t.true(result);
});

test('or should return the first truthy object', (t) => {
  const result = run(GLISP.RootEnv, `
    (or false {})
  `);

  t.true(I.is(result, I.Map()));
});

test('and should work on more than one arg', (t) => {
  const result = run(GLISP.RootEnv, `
    (and true {} #{} (Stack) true false)
  `);

  t.false(result);
});

test('and should return the first falsey object', (t) => {
  const result = run(GLISP.RootEnv, `
    (and true true true true true "")
  `);

  t.is(result, '');
});

test('Map? should tell if an object is a Map', (t) => {
  t.true(run(GLISP.RootEnv, '(Map? {})'));
  t.false(run(GLISP.RootEnv, '(Map? #{})'));
  t.false(run(GLISP.RootEnv, '(Map? ())'));
  t.false(run(GLISP.RootEnv, '(Map? [])'));
  t.false(run(GLISP.RootEnv, '(Map? 0)'));
  t.false(run(GLISP.RootEnv, '(Map? "")'));
});

test('List? should tell if an object is a List', (t) => {
  t.true(run(GLISP.RootEnv, '(List? [])'));
  t.false(run(GLISP.RootEnv, '(List? #{})'));
  t.false(run(GLISP.RootEnv, '(List? ())'));
  t.false(run(GLISP.RootEnv, '(List? {})'));
  t.false(run(GLISP.RootEnv, '(List? 0)'));
  t.false(run(GLISP.RootEnv, '(List? "")'));
});

test('Set? should tell if an object is a Set', (t) => {
  t.true(run(GLISP.RootEnv, '(Set? #{})'));
  t.false(run(GLISP.RootEnv, '(Set? [])'));
  t.false(run(GLISP.RootEnv, '(Set? ())'));
  t.false(run(GLISP.RootEnv, '(Set? {})'));
  t.false(run(GLISP.RootEnv, '(Set? 0)'));
  t.false(run(GLISP.RootEnv, '(Set? "")'));
});

test('Stack? should tell if an object is a Stack', (t) => {
  t.true(run(GLISP.RootEnv, '(Stack? ())'));
  t.false(run(GLISP.RootEnv, '(Stack? [])'));
  t.false(run(GLISP.RootEnv, '(Stack? #{})'));
  t.false(run(GLISP.RootEnv, '(Stack? {})'));
  t.false(run(GLISP.RootEnv, '(Stack? 0)'));
  t.false(run(GLISP.RootEnv, '(Stack? "")'));
});

test('Seq? should tell if an object is a Seq', (t) => {
  t.true(run(GLISP.RootEnv, '(Seq? ((fn [& args] args) 1 2 3))'));
  t.false(run(GLISP.RootEnv, '(Seq? ())'));
  t.false(run(GLISP.RootEnv, '(Seq? [])'));
  t.false(run(GLISP.RootEnv, '(Seq? #{})'));
  t.false(run(GLISP.RootEnv, '(Seq? {})'));
  t.false(run(GLISP.RootEnv, '(Seq? 0)'));
  t.false(run(GLISP.RootEnv, '(Seq? "")'));
});

test('= should work for Fractions and Floating Point numbers', (t) => {
  t.true(run(GLISP.RootEnv, '(= 1 1/1)'));
});

test('= should work for BigNumbers and Floating Point numbers', (t) => {
  t.true(run(GLISP.RootEnv, '(= 1 1M)'));
});

test('= should work for Fractions and BigNumbers point numbers', (t) => {
  t.true(run(GLISP.RootEnv, '(= 1/1 1M)'));
});

test('= should work for all GLISP numbers', (t) => {
  t.true(run(GLISP.RootEnv, '(= 1/2 0.5M 0.5)'));
});

test('= should return false when any GLISP number is not the same', (t) => {
  t.false(run(GLISP.RootEnv, '(= 1/2 0.5M 0.5 (+ 0.25 0.2))'));
});

test('= should not throw on Floating Point errors when comparing Numbers with BigNumbers', (t) => {
  t.notThrows(() => run(GLISP.RootEnv, '(= (+ 0.1 0.2) 0.3M)'));
});

test('= should not throw on Floating Point errors when comparing Numbers with Fractions', (t) => {
  t.notThrows(() => run(GLISP.RootEnv, '(= (+ 0.1 0.2) 3/10)'));
});

function run(env, code) {
  return GLISP.evaluate(env, GLISP.parse(code));
}
