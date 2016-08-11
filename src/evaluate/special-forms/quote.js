import * as I from 'immutable';
import * as Util from '../../util/index';
import evaluate from '../index';

export default function quote(env, args) {
  if (args.size !== 1) {
    throw new Error(`quote expects 1 arg, but was called with ${args.size} args`);
  }

  const [ item ] = args;
  return unquote(env, item);
}

function unquote(env, form) {
  if (! I.Iterable.isIterable(form)) {
    return form;
  }

  if (isUnquoteForm(form)) {
    if (form.size !== 2) {
      throw new Error(`unquote expects 1 arg, but was called with ${form.size - 1} args`);
    }

    const argToUnquote = form.get(1);
    return evaluate(env, argToUnquote);
  }

  if (I.Map.isMap(form) || I.OrderedMap.isOrderedMap(form)) {
    return form.mapEntries(([key, value]) => [
      unquote(env, key),
      unquote(env, value),
    ]);
  }

  return form.map((item) => unquote(env, item));
}

function isUnquoteForm(form) {
  return Util.canExecuteForm(form) && form.first() === Symbol.for('unquote');
}
