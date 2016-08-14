import * as I from 'immutable';
import * as R from 'ramda';
import * as Util from '../util/index';
import executeForm from './execute-form';

const evaluate = R.curry((env, form) => {
  if (typeof form === 'symbol') {
    return getSymbolValue(env, form);
  }

  if (Util.canExecuteForm(form)) {
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

function getSymbolValue(env, symbol) {
  if (Util.isGlobalRef(symbol)) {
    const Global = Util.getGlobal();
    const propName = Util.getGlobalRefName(symbol);

    if (! (propName in Global)) {
      throw new Error('Could not locate ' + propName + ' on global object.');
    }

    return Global[propName];
  }

  if (! (symbol in env)) {
    throw new Error('Trying to access ' + String(symbol) + ' but none found in scope.');
  }

  return env[symbol];
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
