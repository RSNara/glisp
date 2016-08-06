import test from 'ava';
import * as R from 'ramda';
import { parse, evaluate } from '../../index';

test('should return a function', (assert) => {
  const result = evaluate({}, parse(`
    (fn [] 1)
  `));

  assert.truthy(R.is(Function, result));
});

test('should throw an error if argument list is a Stack', (assert) => {
  assert.throws(() => evaluate({}, parse(`
    (fn () 1)
  `)));
});
