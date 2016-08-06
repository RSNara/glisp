import * as R from 'ramda';
import * as Util from '../util/index';
import executeForm from './execute-form';

const evaluate = R.curry((env, form) => {
  if (typeof form === 'symbol') {
    return env[form];
  }

  if (Util.canExecuteForm(form)) {
    return executeForm(env, form);
  }

  return form;
});

export default evaluate;
