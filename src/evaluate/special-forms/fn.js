import * as I from 'immutable';
import * as Util from '../../util/index';
import evaluate from '../index';
import destructure from '../destructure';

export default function fn(env, args) {
  if (args.size === 0) {
    throw new Error(
      'Expected function declaration to have an arguments list, but found none.'
    );
  }

  const [fnArgNames, ...body] = args;

  if (! I.List.isList(fnArgNames)) {
    throw Util.error(
      'Expected function arguments to be a List, but got ' + fnArgNames
    );
  }

  return (...fnArgs) => {
    validateArguments(fnArgNames, I.List(fnArgs));
    const fnEnvironment = Util.create(env, destructure(env, fnArgNames, fnArgs));
    const result = evaluate(fnEnvironment, I.Stack.of(Symbol.for('do'), ...body));
    return result;
  };
}

function validateArguments(argNames, argValues) {
  const argCount = getArgumentCount(argNames);

  if (isVariadic(argNames)) {
    if (argValues.size < argCount) {
      throw Util.error(
        `Variadic function was declared with ${argCount} arguments,`,
        `but only called with ${argValues.size} arguments`,
      );
    }
  } else {
    if (argValues.size !== argCount) {
      throw Util.error(
        `fn declared with ${argCount} arguments was called with ${argValues.size} arguments`,
      );
    }
  }
}

function getArgumentCount(args) {
  const index = args.indexOf(Symbol.for('&'));
  return index === -1 ? args.size : index;
}

function isVariadic(args) {
  return args.indexOf(Symbol.for('&')) !== -1;
}
