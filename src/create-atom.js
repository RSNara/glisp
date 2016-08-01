import * as M from 'mathjs';
import * as Util from './util/index';

export default function createAtom(x) {
  if (x === 'true') {
    return true;
  }

  if (x === 'false') {
    return false;
  }

  if (Util.isFraction(x)) {
    return M.fraction(x);
  }

  if (Util.isNumber(x)) {
    return M.bignumber(x);
  }

  return Symbol.for(x);
}
