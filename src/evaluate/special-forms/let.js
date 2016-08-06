import * as I from 'immutable';
import * as R from 'ramda';
import * as Util from '../../util/index';

import destructure from '../destructure';
import evaluate from '../index';

export default function $let(env, args) {
  const [ bindings, ...body ] = args;
  if ( bindings.size % 2 !== 0) {
    throw new Error('let bindings should be of even length');
  }

  const [...bindingNames] = bindings.filter((_, i) => Util.isEven(i));
  const [...bindingValues] = bindings.filter((_, i) => Util.isOdd(i));

  const kvPairs = R.zip(bindingNames, bindingValues);
  const bindingEnv = kvPairs.reduce((accumulatedEnv, [name, value]) => {
    return {
      ...accumulatedEnv,
      ...destructure(env, name, value),
    };
  }, {});

  const letEnvironment = Util.create(env, bindingEnv);
  return evaluate(letEnvironment, I.Stack.of(Symbol.for('do'), ...body));
}
