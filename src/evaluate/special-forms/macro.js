import * as Util from '../../util/index';
import createFunction from './fn';

export default function $macro(env, args) {
  const fn = createFunction(env, args);
  return Util.transformFnToMacro(fn);
}
