import * as Util from './util/index';

export default function tokenize(program) {
  return Util.stripComments(program)
    .replace(/\[/g, ' [ ')
    .replace(/\]/g, ' ] ')
    .replace(/\(/g, ' ( ')
    .replace(/\)/g, ' ) ')
    .replace(/#{/g, ' #{ ')
    .replace(/([^#]|^){/g, '$1 { ')
    .replace(/}/g, ' } ')
    .split(/[,\s]/)
    .filter(Boolean);
}
