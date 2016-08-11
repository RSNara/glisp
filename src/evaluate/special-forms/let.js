import * as Util from '../../util/index';
import evaluate from '../index';
import destructure from '../destructure';

export default function $let(env, args) {
  const [ bindings, ...body ] = args;
  if ( bindings.size % 2 !== 0) {
    throw new Error('let bindings should be of even length');
  }

  const bindingKeys = bindings.filter((_, i) => Util.isEven(i));
  const bindingValues = bindings.filter((_, i) => Util.isOdd(i));

  // console.log({ bindingKeys, bindingValues });

  const bindingEnv = buildLetBindingEnv(env, bindingKeys, bindingValues);
  const letEnvironment = Util.create(env, bindingEnv);
  return evaluate(letEnvironment, Util.executableForm('do', ...body));
}

function buildLetBindingEnv(outerEnv, ...args) {
  return Util.mergeKvp((env, [key, value]) => {
    const innerEnv = Util.create(outerEnv, env);
    const evaluatedValue = evaluate(innerEnv, value);

    // console.log({ key, evaluatedValue });
    return destructure(key, evaluatedValue);
  }, ...args);
}
