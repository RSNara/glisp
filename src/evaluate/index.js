import * as I from 'immutable';
import * as R from 'ramda';
import * as Util from '../util/index';
import executeForm from './execute-form';

const evaluate = R.curry((env, form) => {
  if (typeof form === 'symbol') {
    if (! (form in env)) {
      throw new Error('Trying to access ' + String(form) + ' but none found in scope.');
    }

    return env[form];
  }

  if (I.Stack.isStack(form) && form.size !== 0) {
    return executeForm(env, form);
  }

  return evaluateColl(env, form);
});

function evaluateColl(env, form) {
  if (shouldMap(form)) {
    return form.map(evaluate(env));
  }

  if (shouldMapEntries(form)) {
    return form.mapEntries(([k, v]) => [
      evaluate(env, k),
      evaluate(env, v),
    ]);
  }

  return form;
}

const shouldMap = or(
  I.List.isList,
  I.Set.isSet,
  I.OrderedSet.isOrderedSet,
  I.Seq.isSeq,
  I.Stack.isStack,
);

const shouldMapEntries = or(
  I.OrderedMap.isOrderedMap,
  I.Map.isMap,
);

function or(...fns) {
  return (x) => {
    return Util.reduce((old, fn) => old || fn(x), false, fns);
  };
}

export default evaluate;
