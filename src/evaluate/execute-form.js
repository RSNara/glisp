import * as Util from '../util/index';
import * as SpecialForms from './special-forms/index';
import evaluate from './index';

export default function executeForm(env, form) {
  if (form.first() === Symbol.for('let')) {
    return SpecialForms.let(env, form.rest());
  }

  if (form.first() === Symbol.for('do')) {
    return SpecialForms.do(env, form.rest());
  }

  if (form.first() === Symbol.for('def')) {
    return SpecialForms.def(env, form.rest());
  }

  if (form.first() === Symbol.for('if')) {
    return SpecialForms.if(env, form.rest());
  }

  if (form.first() === Symbol.for('fn')) {
    return SpecialForms.fn(env, form.rest());
  }

  if (form.first() === Symbol.for('quote')) {
    return SpecialForms.quote(env, form.rest());
  }

  if (form.first() === Symbol.for('unquote')) {
    throw new Error('\'unquote\' call must be inside a \'quote\' call');
  }

  if (form.first() === Symbol.for('macro')) {
    return SpecialForms.macro(env, form.rest());
  }

  /** Procedure call */
  const [ fnForm, ...args ] = form;
  const fn = evaluate(env, fnForm);

  if (typeof fn !== 'function') {
    throw new Error('Tried to call ' + fn + ' as a function.');
  }

  if (Util.isMacro(fn)) {
    return evaluate(env, fn(...args));
  }

  return fn(...args.map(evaluate(env)));
}
