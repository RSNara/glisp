import * as R from 'ramda';
import destructure from './destructure';

export default function destructureIterables(env, [...one], [...two]) {
  const kvPairs = R.zip(one, two);
  return R.reduce((environment, [k, v]) => {
    return {
      ...environment,
      ...destructure(env, k, v),
    };
  }, {}, kvPairs);
}
