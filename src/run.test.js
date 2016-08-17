import test from 'ava';
import * as M from 'mathjs';
import run from './run';

test('should allow setting properties on javascript objects', (assert) => {
  const result = run(`
    (let [object (.toJS {})]
        (aset object "my-key" 10))
  `);

  assert.deepEqual({ 'my-key': M.bignumber(10) }, result );
});

test('should allow getting properties from javascript objects', (assert) => {
  const result = run(`
    (let [object (.toJS {"my-key" 10})]
        (aget object "my-key"))
  `);

  assert.deepEqual(result, M.bignumber(10));
});
