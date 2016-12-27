import * as R from 'ramda';
import * as I from 'immutable';
import * as M from 'mathjs';
import * as iterall from 'iterall';

export function isNumberString(string) {
  return ! Number.isNaN(parseFloat(string)) && ! Number.isNaN(Number(string));
}

export function isBignumberString(string) {
  return string.endsWith('M') && isNumberString(string.slice(0, -1));
}

export function createBignumber(string) {
  return M.bignumber(string.replace(/M$/, ''));
}

export function stripQuotes(string) {
  return string.replace(/(^"|"$)/g, '');
}

export function isFractionString(x) {
  const [numerator, denominator, ...rest] = String(x).split('/');
  return rest.length === 0 && isNumberString(numerator) && isNumberString(denominator);
}

export function getMatchingStartingParens(x) {
  return {
    ')': ['('],
    '}': ['#{', '{'],
    ']': ['['],
  }[x] || [];
}

export function isEndingParen(x) {
  return ['}', ')', ']'].includes(x);
}

export function isStartingParen(x) {
  return ['#{', '{', '(', '['].includes(x);
}

export function serializeArray(x) {
  return `[${x.join(', ')}]`;
}

export function conj(collection, item) {
  if (I.List.isList(collection)) {
    return collection.push(item);
  }

  if (I.Set.isSet(collection)) {
    return collection.add(item);
  }

  if (I.OrderedSet.isOrderedSet(collection)) {
    return collection.add(item);
  }

  if (I.Map.isMap(collection)) {
    const [key, value] = item;
    return collection.set(key, value);
  }

  if (I.OrderedMap.isOrderedMap(collection)) {
    const [key, value] = item;
    return collection.set(key, value);
  }

  if (I.Stack.isStack(collection)) {
    return collection.push(item);
  }

  throw new Error('Collection is not an Immutable object');
}

export function create(prototype, ...props) {
  return Object.assign(Object.create(prototype), ...props);
}

export function isEven(x) {
  return x % 2 === 0;
}

export function isOdd(x) {
  return x % 2 === 1;
}

export function transformFnToMacro(fn) {
  Object.defineProperty(fn, 'isMacro', {
    value: true,
  });
  return fn;
}

export function isMacro(fn) {
  return fn.isMacro;
}

export function canExecuteForm(form) {
  return I.Stack.isStack(form) && form.size > 0;
}

export const reduce = R.curry((reducer, initial, collection) => {
  let reduced = initial;
  iterall.forEach(collection, (item) => {
    reduced = reducer(reduced, item);
  });
  return reduced;
});

export const conjunct = R.curry((fn, args) => {
  const [first, ...rest] = args;
  return reduce(
    ([result, old], current) => [result && fn(old, current), current],
    [true, first],
    rest,
  )[0];
});

export const disjunct = R.curry((fn, args) => {
  const [first, ...rest] = args;
  return reduce(
    ([result, old], current) => [result || fn(old, current), current],
    [false, first],
    rest,
  )[0];
});

export function toArray(collection) {
  return reduce((array, element) => [...array, element], [], collection);
}

export function error(...message) {
  return new Error(message.join(' '));
}

export const mergeKvp = R.curry((next, keys, values) => {
  const kvPairs = zip(toArray(keys), toArray(values), () => void 0);
  return R.reduce(merge, {}, kvPairs);

  function merge(running, [k, v]) {
    return {
      ...running,
      ...next(running, [k, v]),
    };
  }
});

export function executableForm(name, ...body) {
  return I.Stack.of(Symbol.for(name), ...body);
}

export function zip(keys, values, factory) {
  return keys.map((key, i) => [ key, i >= values.length ? factory() : values[i] ]);
}

export function isGlobalRef(symbol) {
  return String(symbol).startsWith('Symbol(js/');
}

export function isMethodCall(form) {
  const fnName = form.first();
  return typeof fnName === 'symbol' && String(fnName).startsWith('Symbol(.');
}

export function getGlobal() {
  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  throw new Error('Could not find global object.');
}

export function getSymbolName(symbol) {
  return /Symbol\(([^)]*)\)/.exec(String(symbol))[1];
}

export function getMethodName(symbol) {
  return getSymbolName(symbol).replace(/^\./, '');
}

export function getGlobalRefName(symbol) {
  return getSymbolName(symbol).replace(/^js\//, '');
}

export function is(one, two) {
  if ([one, two].every(isGLISPNumber)) {
    return M.equal(M.bignumber(one), M.bignumber(two));
  }

  return I.is(one, two);
}

function isGLISPNumber(x) {
  if (R.is(Number, x)) {
    return true;
  }

  if (x) {
    return ['Fraction', 'BigNumber'].includes(x.type);
  }

  return false;
}
