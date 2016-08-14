# GLISP - The G LISP Interpreter

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
  (+ one two)) ;; 3

;; quotes
(quote (1 2)) ;; (1 2)

;; unquotes
(let [one 1] (quote (unquote one))) ;; 1

;; do
(do
  (+ 1 2)
  (+ 3 4)) ;; 7

;; conditionals
(if (= 1 1) true false) ;; true

;; macros
(def defn (macro [name args body]
            (quote
              (def (unquote name) (fn (unquote args) (unquote body))))))

(defn double [x] (* x 2))
(double 2) ;; 4
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

### Destructuring

Within `let` bindings and `fn` declarations, one can destructure any collection that conforms to an iteration protocol understood by [Iterall](https://github.com/leebyron/iterall).

```Clojure
;; Get all arguments
(def create-seq [& args] args)
(create-seq 1 2 3 4 5)  ;; [1 2 3 4 5]

;; Get the first element
(def first (fn [[x]] x))
(first ["first!" #{}])  ;; "first!"

;; Get everything but the first element
(def rest (fn [[x & args]] args))
(rest [1 2 3 4 5])  ;; [2 3 4 5]

;; Works in let bindings
(let [[x y] [1 2]
      sum (+ x y)]
  sum) ;; 3

;; Ooo... destructure any iterable
(let [[x y] (quote (1 2))]
  [x y]) ;; [1 2]
```

### Numbers
For the time being all numbers are either instances of [BigNumber](https://github.com/MikeMcl/bignumber.js/), or [Fraction](https://github.com/infusion/Fraction.js/). Support for floating point numbers will be added later on.

```Clojure
;; BigNumbers!
(+ 0.1 0.2) ;; 0.3

;; Fractions
(+ 1/3 2/3) ;; 1
```

### Strings
Strings exist and can be created using double quotes.

```Clojure
"Produce side effects!"
"This is a multiline string!
  Yay!"
"You can also \"quote\" within strings!")
```

### JavaScript Interop
Symbols prefixed with `js/` will evaluate to the respective property on the `global` object. Method calls can be made by prefixing the method name with a `.`.

```Clojure
;; use window.console or global.console
(.log js/console 1 2 3 4 5)

;; push to a List
(.push [1 2 3] 10)
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
