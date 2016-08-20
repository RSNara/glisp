import test from 'ava';
import * as GLISP from './index';
import * as R from 'ramda';
import * as M from 'mathjs';

const bignumber = (x) => M.bignumber(x);
const fraction = (x) => M.fraction(x);

test('should parse JavaScript numbers correctly', (assert) => {
  const numbers = [0, -1, -0.00001, 1.011, 1];
  const strings = ['0', '-1', '-0.00001', '1.011', '1'];

  R.zip(numbers, strings).forEach(([number, string]) => {
    assert.is(number, run({}, string));
  });
});

test('should parse numbers suffixed with an \'M\' as BigNumbers', (assert) => {
  const numbers = [0, -1, -0.00001, 1.011, 1].map(bignumber);
  const strings = ['0M', '-1M', '-0.00001M', '1.011M', '1M'];

  R.zip(numbers, strings).forEach(([number, string]) => {
    assert.truthy(M.equal(number, run({}, string)));
  });
});

test('should parse numbers suffixed with a \'/\' in between as Fractions', (assert) => {
  const strings = ['1/10', '-1/10', '-1/20', '1/30', '1/50'];
  const numbers = strings.map(fraction);

  R.zip(numbers, strings).forEach(([number, string]) => {
    assert.truthy(M.equal(number, run({}, string)));
  });
});

test('should not parse fractions containing non natural numerators', (assert) => {
  const error = assert.throws(() => run({}, '1.1/1'));
  assert.is(error, 'Invalid Param');
});

function run(env, code) {
  return GLISP.evaluate(env, GLISP.parse(code));
}
