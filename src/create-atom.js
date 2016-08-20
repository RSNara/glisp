import * as M from 'mathjs';
import * as Util from './util/index';

export default function createAtom(x) {
  if (x === 'true') {
    return true;
  }

  if (x === 'false') {
    return false;
  }

  if (Util.isFractionString(x)) {
    return M.fraction(x);
  }

  if (Util.isBignumberString(x)) {
    return Util.createBignumber(x);
  }

  if (Util.isNumberString(x)) {
    return Number(x);
  }

  if (isActualString(x)) {
    return Util.stripQuotes(x);
  }

  return Symbol.for(x);
}

function isActualString(string) {
  return string.startsWith('"') && string.endsWith('"');
}
