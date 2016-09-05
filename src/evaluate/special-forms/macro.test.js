import test from 'ava';
import * as M from 'mathjs';
import * as Util from '../../util/index';
import { parse, evaluate, RootEnv } from '../../index';

const symbol = (x) => Symbol.for(x);

test('should enable the implementation of defn', (t) => {
  const env = Util.create(RootEnv, {
    [Symbol.for('concat')]: (coll, x) => coll.concat(x),
  });
  run(env, `
    (do
      (def defn
        (macro [name arg-names & body]
          (Stack 'def name (concat (Stack 'fn arg-names) body))))
      (defn add [x y] 1 (+ x y))
      (defn identity [x] x))
  `);

  const uniqueObject = {};
  const identity = env[symbol('identity')];
  const add = env[symbol('add')];

  t.is(identity(uniqueObject), uniqueObject);
  t.is(add(1, 2), 3);
});

test('should enable the implementation of apply', (t) => {
  const env = Util.create(RootEnv, {
    [Symbol.for('concat')]: (coll, el) => coll.concat(el),
  });

  const result = run(env, `
    (do
      (def apply
        (macro [ func args ] (concat (Stack func) args)))
      (apply < [1 2 3 4 5 6]))
  `);

  t.truthy(result);
});

test('should enable the implementation of ->', (t) => {
  const env = Util.create(RootEnv, {
    [Symbol.for('reduce')]: Util.reduce,
    [Symbol.for('concat')]: (collection, item) => collection.concat(item),
  });

  const result = run(env, `
    (do
      (def inc (fn [x] (+ x 1)))
      (def ->
        (macro [init & forms]
               (reduce  (fn [previous-form current]
                          (if (Stack? current)
                            (let [[func & args] current]
                                (concat (Stack func previous-form) args))
                            (Stack current previous-form)))
                        init
                        forms)))
      (-> 1 (* 2) inc (* 2) (- 1)))
  `);

  t.truthy(M.equal(result, 5));
});

function run(env, code) {
  return evaluate(env, parse(code));
}
