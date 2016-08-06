import * as I from 'immutable';
import * as M from 'mathjs';
import * as Util from './util/index';

export default {
  [Symbol.for('+')]: (...args) => args.reduce((x, y) => M.add(x, y)),
  [Symbol.for('-')]: (...args) => args.reduce((x, y) => M.subtract(x, y)),
  [Symbol.for('*')]: (...args) => args.reduce((x, y) => M.multiply(x, y)),
  [Symbol.for('/')]: (...args) => args.reduce((x, y) => M.divide(x, y)),
  [Symbol.for('!')]: (x) => !x,
  [Symbol.for('=')]: (...args) => Util.conjunct((x, y) => I.is(x, y), args),
  [Symbol.for('<')]: (...args) => Util.conjunct((x, y) => M.smaller(x, y), args),
  [Symbol.for('>')]: (...args) => Util.conjunct((x, y) => M.larger(x, y), args),
  [Symbol.for('reduce')]: Util.reduce,
};
