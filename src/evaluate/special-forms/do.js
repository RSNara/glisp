import evaluate from '../index';

export default function $do(env, args) {
  return args.map(evaluate(env)).last();
}
