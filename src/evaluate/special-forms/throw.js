import evaluate from '../index';

export function $throw(env, forms) {
  if (forms.size !== 1) {
    throw new Error('(throw ,,,) expects exactly one argument');
  }

  const error = evaluate(env, forms.first());

  if (! (error instanceof Error)) {
    throw new Error('(throw ...) expects the throw object to be an Error instance');
  }

  throw error;
}

export default $throw;
