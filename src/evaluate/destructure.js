import * as I from 'immutable';
import * as iterall from 'iterall';
import * as Util from '../util/index';
import evaluate from './index';
import destructureIterables from './destructure-iterables';

export default function destructure(env, key, form) {
  const evaluatedValue = evaluate(env, form);

  if (typeof key === 'symbol') {
    return {
      [key]: evaluatedValue,
    };
  }

  if (I.List.isList(key)) {
    if (! iterall.isCollection(evaluatedValue)) {
      throw Util.error(
        'Expected binding to support an iteration protocol, but got ' + evaluatedValue
      );
    }

    if (isVariadic(key)) {
      const argNames = key.butLast().butLast();
      const restName = key.last();

      const evaluatedValueSeq = I.Seq(evaluatedValue);
      const argValues = evaluatedValueSeq.slice(0, argNames.size);
      const restValue = evaluatedValueSeq.slice(argNames.size);

      return {
        ...destructureIterables(env, argNames, argValues),
        ...destructure(env, restName, restValue),
      };
    }

    return destructureIterables(env, key, evaluatedValue);
  }

  throw Util.error(`Failed to destructure (${key}, ${evaluatedValue})`);
}

function isVariadic(key) {
  const iterable = I.List(key);
  const variadicSymbol = Symbol.for('&');

  if (iterable.size >= 1 && iterable.last() === variadicSymbol) {
    throw Util.error('Unexpected \'&\' as last item in binding name.');
  }

  if (iterable.size >= 2 && iterable.get(iterable.size - 2) === variadicSymbol) {
    if (iterable.butLast().butLast().contains(variadicSymbol)) {
      throw Util.error('Detected two \'&\' in destructuring assignment LHS');
    }

    return true;
  }

  return false;
}
