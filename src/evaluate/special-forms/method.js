import * as R from 'ramda';
import * as Util from '../../util/index';
import evaluate from '../index';

export default function method(env, form) {
  if (form.size < 2) {
    throw new Error('Method calls must be made with an object as the first argument, found none.');
  }

  const [ object, ...args ] = form.rest().map(evaluate(env));

  if (R.isNil(object)) {
    throw new Error(`Unexpected method call on ${object}`);
  }

  const prop = Util.getMethodName(form.first());

  if (! R.is(Function, object[prop])) {
    throw new Error(
      `Expected "${prop}" in object ${object} to be a function, instead found ${object[prop]}`
    );
  }

  return object[prop](...args);
}
