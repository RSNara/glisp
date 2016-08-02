import * as I from 'immutable';
import * as M from 'mathjs';
import * as R from 'ramda';

const conjunct = R.curry((fn, args) => {
  const [first, ...rest] = args;
  return rest.reduce(
    ([result, old], current) => [result && fn(old, current), current],
    [true, first]
  )[0];
});

export default {
  [Symbol.for('+')]: (...args) => args.reduce((x, y) => M.add(x, y)),
  [Symbol.for('-')]: (...args) => args.reduce((x, y) => M.subtract(x, y)),
  [Symbol.for('*')]: (...args) => args.reduce((x, y) => M.multiply(x, y)),
  [Symbol.for('/')]: (...args) => args.reduce((x, y) => M.divide(x, y)),
  [Symbol.for('!')]: (x) => !x,
  [Symbol.for('=')]: (...args) => conjunct((x, y) => I.is(x, y), args),
  [Symbol.for('<')]: (...args) => conjunct((x, y) => M.smaller(x, y), args),
  [Symbol.for('>')]: (...args) => conjunct((x, y) => M.larger(x, y), args),
};
