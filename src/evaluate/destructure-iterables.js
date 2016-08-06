import * as R from 'ramda';
import * as Util from '../util/index';
import destructure from './destructure';

export default function destructureIterables(outerEnv, one, two) {
  const kvPairs = R.zip(Util.toArray(one), Util.toArray(two));
  return R.reduce((innerEnv, [k, v]) => {
    return {
      ...innerEnv,
      ...destructure(Util.create(outerEnv, innerEnv), k, v),
    };
  }, {}, kvPairs);
}
