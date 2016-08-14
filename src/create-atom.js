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

  if (isString(x)) {
    return x.substring(1, x.length - 1);
  }

  return Symbol.for(x);
}

function isString(string) {
  return string.startsWith('"') && string.endsWith('"');
}
