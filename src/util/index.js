import * as R from 'ramda';
import * as I from 'immutable';
import * as iterall from 'iterall';

export function isNumber(x) {
  return ! Number.isNaN(parseFloat(x)) && ! Number.isNaN(Number(x));
}

export function isFraction(x) {
  const [numerator, denominator, ...rest] = String(x).split('/');
  return rest.length === 0 && isNumber(numerator) && isNumber(denominator);
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
  return I.Stack.isStack(form);
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

export function toArray(collection) {
  return reduce((array, element) => [...array, element], [], collection);
}

export function error(...message) {
  return new Error(message.join(' '));
}

export const mergeKvp = R.curry((next, keys, values) => {
  const kvPairs = R.zip(toArray(keys), toArray(values));
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

export const stripComments = R.compose(
  R.join(''),
  R.map(R.replace(/;.*$/, '')),
  R.split(/\n/g)
);
