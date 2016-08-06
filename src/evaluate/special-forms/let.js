import * as I from 'immutable';
import * as Util from '../../util/index';

import destructureIterables from '../destructure-iterables';
import evaluate from '../index';

export default function $let(env, args) {
  const [ bindings, ...body ] = args;
  if ( bindings.size % 2 !== 0) {
    throw new Error('let bindings should be of even length');
  }

  const bindingNames = bindings.filter((_, i) => Util.isEven(i));
  const bindingValues = bindings.filter((_, i) => Util.isOdd(i));

  const letBindingEnv = destructureIterables(env, bindingNames, bindingValues);
  const letEnvironment = Util.create(env, letBindingEnv);
  return evaluate(letEnvironment, I.Stack.of(Symbol.for('do'), ...body));
}
