# GLISP - The G LISP Interpreter

[![Build Status](https://travis-ci.org/rsnara/glisp.svg?branch=master)](https://travis-ci.org/rsnara/glisp)
[![Coverage Status](https://coveralls.io/repos/github/rsnara/glisp/badge.svg?branch=master)](https://coveralls.io/github/rsnara/glisp?branch=master)

This is a LISP interpreter, with built-in support for arbitrary precision arithmetic, and immutable data structures.

## Usage
```JavaScript
const { run } = require('glisp');

run('(+ 1 2)') // 3
```

## Language Features
```Clojure
;; variables
(def one 1)

;; functions
(def id (fn [x] x))

;; let bindings
(let [one 1 two 2]
  (+ one two))  ;; 3

;; quotes
(quote (1 2)) ;; (1 2)

;; unquotes
(let [one 1] (quote (unquote one))) ;; 1

;; do
(do
  (+ 1 2)
  (+ 3 4))  ;; 7

;; conditionals
(if (= 1 1) true false) ;; true

;; macros
(def defn (macro [name args body]
            `(def ~name (fn ~args ~body)))))

(defn double [x] (* x 2))
(double 2)  ;; 4

;; throw errors!
(throw (js/Error "throw up!"))
```

### Data Structures
GLISP uses [Immutable.js](https://facebook.github.io/immutable-js/) to power its immutable data structures. GLISP recognizes `Immutable.Stack` as an executable form.

```Clojure
;; Set
#{1 2 3 4 5}

;; Map
{1 2 3 4}

;; List
[1 2 3 4]

;; Stack
(quote (1 2 3))
```

### JavaScript Interop
Symbols prefixed with `js/` will evaluate to the respective property on the `global` object. Method calls can be made by prefixing the method name with a `.`.

```Clojure
;; use window.console or global.console
(.log js/console 1 2 3 4 5)

;; push to a List
(.push [1 2 3] 10)

;; set properties on objects
(let [object (.toJS {})]
  (aset object "name" "Ramanpreet Nara")
  (aset object "age" 20)) ;; { name: "Ramanpreet Nara", age: 20 }

;; get properties on objects
(aget (.toJS {"age" 21}) "age") ;; 21
```

### Destructuring

Within `let` bindings and `fn` declarations, destructure any collection that conforms to an iteration protocol understood by [Iterall](https://github.com/leebyron/iterall).

```Clojure
;; get all args
(def create-seq (fn [& args] args))
(create-seq 1 2 3 4 5)  ;; [1 2 3 4 5]

;; get everything but the first element
(def rest (fn [[x & args]] args))
(rest [1 2 3 4 5])  ;; [2 3 4 5]

;; works in let bindings
(let [[x y] [1 2]]
  (+ x y)) ;; 3

;; ooo... destructure any iterable
(let [[x y] (quote (1 2))]
  [x y]) ;; [1 2]
```

### Numbers
GLISP supports JavaScript's 64 bit floating point numbers, [BigNumber](https://github.com/MikeMcl/bignumber.js/)s, and [Fraction](https://github.com/infusion/Fraction.js/)s.

```Clojure
;; Floating points!
(+ 0.1 0.2) ;; 0.30000000000000004

;; BigNumbers!
(+ 0.1M 0.2M) ;; 0.3

;; Fractions
(+ 1/3 2/3) ;; 1

;; Compare different number types!
(= 1/1 1 1M) ;; true

;; Beware of floating point errors!
(= (+ 0.1 0.2) 0.3M) ;; throws: Cannot convert a number with >15 significant digits to BigNumber!
(= (+ 0.1 0.2) 3/10) ;; throws: Cannot convert a number with >15 significant digits to Fraction!
```

### Strings
Strings exist and can be created using double quotes.

```Clojure
"Produce side effects!"
"This is a multiline string!
  Yay!"
"You can also \"quote\" within strings!")
```

## Development

```BASH
# Run tests
> npm test

# Rebuild on file changes
> npm run build:watch

# Launch REPL
> npm run repl
```
