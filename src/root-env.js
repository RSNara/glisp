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
  [Symbol.for('List')]: (...args) => I.List.of(...args),
  [Symbol.for('List?')]: (x) => I.List.isList(x),
  [Symbol.for('Set')]: (...args) => I.Set.of(...args),
  [Symbol.for('Set?')]: (x) => I.Set.isSet(x),
  [Symbol.for('Stack')]: (...args) => I.Stack.of(...args),
  [Symbol.for('Stack?')]: (x) => I.Stack.isStack(x),
  [Symbol.for('Map')]: (...args) => I.Map.of(...args),
  [Symbol.for('Map?')]: (x) => I.Map.isMap(x),
};
