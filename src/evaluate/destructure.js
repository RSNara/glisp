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
      throw new Error(
        'Expected binding to support an iteration protocol, but got ' + evaluatedValue
      );
    }

    if (key.last() === Symbol.for('&')) {
      throw new Error('Unexpected \'&\' as last item in binding name.');
    }

    if (key.size >= 2 && key.get(key.size - 2) === Symbol.for('&')) {
      const argNames = key.slice(0, key.size - 2);
      const restName = key.last();

      if (argNames.contains(Symbol.for('&'))) {
        throw new Error('Detected two \'&\' in destructuring assignment LHS');
      }

      const [ argValues, restValue ] = Util.splitAtNth(key.size - 2, evaluatedValue);

      return {
        ...destructure(env, restName, I.Stack.of(Symbol.for('quote'), restValue)),
        ...destructureIterables(env, argNames, argValues),
      };
    }
  }

  throw new Error(`Failed to destructure (${key}, ${evaluatedValue})`);
}
