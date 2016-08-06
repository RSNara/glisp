import evaluate from '../index';

export default function $do(env, args) {
  /**
   * Immutable.Stack.prototype.map's iterates over the stack from bottom to top.
   * To evaluate the expressions top to bottom, we reverse the stack.
   * To return the result of the last expression, we return .first().
   */
  return args.reverse().map(evaluate(env)).first();
}
