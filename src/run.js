import * as Util from './util/index';
import parse from './parse';
import evaluate from './evaluate';
import RootEnv from './root-env';

export default function run(code) {
  return evaluate(Util.create(RootEnv), parse(code));
}
