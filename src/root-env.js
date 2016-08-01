import * as I from 'immutable';
import * as M from 'mathjs';

export default {
  [Symbol.for('+')]: (...args) => args.reduce((a, b) => M.add(a, b)),
  [Symbol.for('-')]: (...args) => args.reduce((a, b) => M.subtract(a, b)),
  [Symbol.for('*')]: (...args) => args.reduce((a, b) => M.multiply(a, b)),
  [Symbol.for('/')]: (...args) => args.reduce((a, b) => M.divide(a, b)),
  [Symbol.for('=')]: (...args) => args.reduce((a, b) => I.is(a, b)),
  [Symbol.for('!')]: (x) => !x,
  [Symbol.for('<')]: (...args) => conjunct((a, b) => M.smaller(a, b), args),
  [Symbol.for('>')]: (...args) => conjunct((a, b) => M.larger(a, b), args),
};

function conjunct(fn, args) {
  const [first, ...rest] = args;
  return rest.reduce(
    ([result, old], current) => [result && fn(old, current), current],
    [true, first]
  )[0];
}
