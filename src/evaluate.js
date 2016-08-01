import * as I from 'immutable';
import * as R from 'ramda';
import * as Util from './util/index';

const evaluate = R.curry((env, form) => {
  if (typeof form === 'symbol') {
    return env[form];
  }

  if (! I.List.isList(form)) {
    return form;
  }

  if (form.first() === Symbol.for('let')) {
    return $let(env, form);
  }

  if (form.first() === Symbol.for('do')) {
    return form.rest().map(evaluate(env)).last();
  }

  if (form.first() === Symbol.for('def')) {
    return $def(env, form);
  }

  if (form.first() === Symbol.for('if')) {
    const [test, conseq, alt] = form.rest();
    return evaluate(env, test) ? evaluate(env, conseq) : evaluate(env, alt);
  }

  if (form.first() === Symbol.for('fn')) {
    return $fn(env, form);
  }

  if (form.first() === Symbol.for('quote')) {
    return $quote(env, form);
  }

  if (form.first() === Symbol.for('unquote')) {
    throw new Error('\'unquote\' call must be inside a \'quote\' call');
  }

  if (form.first() === Symbol.for('macro')) {
    return $macro(env, form);
  }

  /** Procedure call */
  const [ fn, ...args ] = form;

  if (Util.isMacro(env[fn])) {
    return evaluate(env, env[fn](...args));
  }

  return env[fn](...args.map(evaluate(env)));
});

export default evaluate;

function $quote(env, form) {
  const [ item ] = form.rest();

  if (form.size !== 2) {
    throw new Error(`quote expects 1 arg, but was called with ${form.size - 1} args`);
  }

  return $unquote(env, item);
}

function $unquote(env, form) {
  if (! I.Iterable.isIterable(form)) {
    return form;
  }

  if (I.List.isList(form) && form.first() === Symbol.for('unquote')) {
    if (form.size !== 2) {
      throw new Error(`unquote expects 1 arg, but was called with ${form.size - 1} args`);
    }

    return evaluate(env, form.rest().first());
  }

  if (I.Map.isMap(form) || I.OrderedMap.isOrderedMap(form)) {
    return form.mapEntries(([key, value]) => [
      $unquote(env, key),
      $unquote(env, value),
    ]);
  }

  return form.map((item) => $unquote(env, item));
}

function $let(env, form) {
  const [ bindings, ...body ] = form.rest();
  if ( bindings.size % 2 !== 0) {
    throw new Error('let bindings should be of even length');
  }

  const [...bindingNames] = bindings.filter((_, i) => Util.isEven(i));
  const [...bindingValues] = bindings.filter((_, i) => Util.isOdd(i)).map(evaluate(env));
  const letEnvironment = Util.create(env, R.zipObj(bindingNames, bindingValues));
  return evaluate(letEnvironment, doWrap(body));
}

function $def(env, form) {
  const [name, value, ...rest] = form.rest();

  if (rest.length > 0) {
    throw new Error('def expects only two arguments');
  }

  env[name] = evaluate(env, value);
}

function $macro(env, form) {
  return Util.transformFnToMacro($fn(env, form));
}

function $fn(env, form) {
  const [[...argNames], ...body] = form.rest();
  if (! argNames.every(arg => typeof arg === 'symbol')) {
    throw new Error('fn argument list contains a non-symbol');
  }

  return (...args) => {
    if (args.length !== argNames.length) {
      throw new Error(
        `fn declared with ${argNames.length} arguments, but called with ${args.length}`
      );
    }

    const fnEnvironment = Util.create(env, R.zipObj(argNames, args));
    const result = evaluate(fnEnvironment, doWrap(body));
    return result;
  };
}

function doWrap(forms) {
  return I.List.of(Symbol.for('do')).concat(forms);
}
