# GLISP - The G LISP Interpreter

This is a LISP interpreter, with built-in support for arbitrary precision arithmetic, and immutable data structures.

## Usage
```JavaScript
const { run } = require('glisp');

run('(+ 1 2)') // 3
```

## Language Features
```LISP
;; variables
(def one 1)

;; functions
(def id (fn (x) x))

;; let bindings
(let (one 1 two 2)
  (+ one two)) ;; 3

;; quotes
(quote (1 2)) ;; (1 2)

;; unquotes
(let (one 1) (quote (unquote one))) ;; 1

;; do
(do
  (+ 1 2)
  (+ 3 4)) ;; 7

;; conditionals
(if (= 1 1) true false) ;; true

;; macros
(def defn (macro (name args body)
            (quote
              (def (unquote name) (fn (unquote args) (unquote body))))))

(defn double (x) (* x 2))
(double 2) ;; 4

;; destructuring iterables
(let [[one two] [1 2]]
  (+ one two)) ;; 3
```

## Data Structures
GLISP uses [Immutable.js](https://facebook.github.io/immutable-js/) to power its immutable data structures. GLISP recognizes `Immutable.Stack` as an executable form.

```LISP
;; Set
#{1 2 3 4 5}

;; Map
{1 2 3 4}

;; List
[1 2 3 4]

;; Stack
(quote (1 2 3))
```

## Numbers
For the time being all numbers are instances of [BigNumber](https://github.com/MikeMcl/bignumber.js/). There is support for fractional numbers. Support for floating point numbers will be added later on.

```LISP
;; BigNumbers!
(+ 0.1 0.2) ;; 0.3

;; Fractions
(+ 1/3 2/3) ;; 1
```

## Development

```BASH
# Launch REPL
> npm run repl

# Rebuild on file changes
> npm run build:watch
```
