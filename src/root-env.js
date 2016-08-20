import * as I from 'immutable';
import * as M from 'mathjs';
import * as Util from './util/index';

const ROOT_ENV = {
  [Symbol.for('+')]: (...args) => args.reduce((x, y) => M.add(x, y)),
  [Symbol.for('-')]: (...args) => args.reduce((x, y) => M.subtract(x, y)),
  [Symbol.for('*')]: (...args) => args.reduce((x, y) => M.multiply(x, y)),
  [Symbol.for('/')]: (...args) => args.reduce((x, y) => M.divide(x, y)),
  [Symbol.for('!')]: (x) => !x,
  [Symbol.for('=')]: (...args) => Util.conjunct((x, y) => Util.is(x, y), args),
  [Symbol.for('<')]: (...args) => Util.conjunct((x, y) => M.smaller(x, y), args),
  [Symbol.for('>')]: (...args) => Util.conjunct((x, y) => M.larger(x, y), args),
  [Symbol.for('and')]: (...args) => Util.conjunct((x, y) => x && y, args),
  [Symbol.for('or')]: (...args) => Util.disjunct((x, y) => x || y, args),
  [Symbol.for('mod')]: M.mod,
  [Symbol.for('abs')]: M.abs,
  [Symbol.for('floor')]: M.floor,
  [Symbol.for('ceil')]: M.ceil,
  [Symbol.for('gcd')]: M.gcd,
  [Symbol.for('round')]: M.round,
  [Symbol.for('pow')]: M.pow,
  [Symbol.for('conj')]: Util.conj,
  [Symbol.for('List')]: (...args) => I.List.of(...args),
  [Symbol.for('List?')]: (x) => I.List.isList(x),
  [Symbol.for('Set')]: (...args) => I.Set.of(...args),
  [Symbol.for('Set?')]: (x) => I.Set.isSet(x),
  [Symbol.for('Stack')]: (...args) => I.Stack.of(...args),
  [Symbol.for('Stack?')]: (x) => I.Stack.isStack(x),
  [Symbol.for('Map')]: (...args) => I.Map.of(...args),
  [Symbol.for('Map?')]: (x) => I.Map.isMap(x),
  [Symbol.for('Seq')]: (...args) => I.Seq.of(...args),
  [Symbol.for('Seq?')]: (x) => I.Seq.isSeq(x),
  [Symbol.for('aset')]: (object, key, value) => { object[key] = value; return object; },
  [Symbol.for('aget')]: (object, key) => object[key],
  [Symbol.for('fromJS')]: I.fromJS,
};

export default ROOT_ENV;
