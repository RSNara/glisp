import * as I from 'immutable';
import * as Util from '../../util/index';
import evaluate from '../index';
import destructureIterables from '../destructure-iterables';

export default function fn(env, args) {
  const [fnArgNames, ...body] = args;

  if (! I.List.isList(fnArgNames)) {
    throw new Error(
      'Expected function arguments to be a List, but got ' + fnArgNames
    );
  }

  return (...fnArgs) => {
    if (fnArgs.length !== fnArgNames.length) {
      throw new Error(
        `function declared with ${fnArgNames.length} args was called with ${fnArgs.length} args`
      );
    }

    const fnEnvironment = Util.create(env, destructureIterables(env, fnArgNames, fnArgs));
    const result = evaluate(fnEnvironment, I.Stack.of(Symbol.for('do'), ...body));
    return result;
  };
}
