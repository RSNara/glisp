import * as R from 'ramda';
import * as Util from '../util/index';
import destructure from './destructure';

export default function destructureIterables(env, one, two) {
  const kvPairs = R.zip(Util.toArray(one), Util.toArray(two));
  return R.reduce((environment, [k, v]) => {
    return {
      ...environment,
      ...destructure(env, k, v),
    };
  }, {}, kvPairs);
}
