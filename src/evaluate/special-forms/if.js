import evaluate from '../index';

export default function $if(env, args) {
  const [test, conseq, alt] = args;
  return evaluate(env, test) ? evaluate(env, conseq) : evaluate(env, alt);
}
