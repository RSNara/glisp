import test from 'ava';
import * as M from 'mathjs';
import run from './run';

test('should allow setting properties on javascript objects', (assert) => {
  const result = run(`
    (let [object (.toJS {})]
      (aset object "name" "Ramanpreet Nara")
      (aset object "age" 20))
  `);

  assert.deepEqual({ name: 'Ramanpreet Nara', age: M.bignumber(20) }, result );
});

test('should allow getting properties from javascript objects', (assert) => {
  const result = run(`
    (aget (.toJS {"age" 21}) "age")
  `);

  assert.deepEqual(result, M.bignumber(21));
});
