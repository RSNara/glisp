import * as I from 'immutable';
import * as iterall from 'iterall';
import * as Util from '../util/index';

const destructureIterables = Util.mergeKvp((env, [k, v]) => destructure(k, v));

export default function destructure(bindingKey, bindingValue) {
  if (typeof bindingKey === 'symbol') {
    return {
      [bindingKey]: bindingValue,
    };
  }

  if (I.List.isList(bindingKey)) {
    if (! iterall.isCollection(bindingValue)) {
      throw Util.error(
        'Expected binding to support an iteration protocol, but got ' + bindingValue
      );
    }

    if (isVariadic(bindingKey)) {
      const argKeys = bindingKey.butLast().butLast();
      const restKey = bindingKey.last();

      const bindingValueSeq = I.Seq(bindingValue);
      const argValues = bindingValueSeq.slice(0, argKeys.size);
      const restValue = bindingValueSeq.slice(argKeys.size);

      return {
        ...destructureIterables(argKeys, argValues),
        ...destructure(restKey, restValue),
      };
    }

    return destructureIterables(bindingKey, bindingValue);
  }

  throw Util.error(`Failed to destructure (${bindingKey}, ${bindingValue})`);
}

function isVariadic(iterable) {
  const bindingKey = I.List(iterable);
  const variadicSymbol = Symbol.for('&');

  if (bindingKey.size >= 1 && bindingKey.last() === variadicSymbol) {
    throw Util.error('Unexpected \'&\' as last item in binding key', bindingKey);
  }

  if (bindingKey.size >= 2 && bindingKey.get(bindingKey.size - 2) === variadicSymbol) {
    if (bindingKey.butLast().butLast().contains(variadicSymbol)) {
      throw Util.error('Detected two \'&\' in binding key', bindingKey);
    }

    return true;
  }

  return false;
}
