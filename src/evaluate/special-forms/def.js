import evaluate from '../index';

export default function def(env, args) {
  const [name, value] = args;

  if (args.size !== 2) {
    throw new Error(`expected def to be called with 2 args, but called with ${args.size}`);
  }

  env[name] = evaluate(env, value);
  return env[name];
}
