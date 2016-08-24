import test from 'ava';
import * as td from 'testdouble';
import * as I from 'immutable';

const createAtom = td.replace('./create-atom', x => x);
const createAst = require('./create-ast').default;

test('should build a Stack when it encounters ()', (assert) => {
  const tokens = ['(', ')'];
  const ast = createAst(tokens);
  assert.truthy(I.is(ast, I.Stack()));
});

test('should build a List when it encounters []', (assert) => {
  const tokens = ['[', ']'];
  const ast = createAst(tokens);
  assert.truthy(I.is(ast, I.List()));
});

test('should build a Set when it encounters #{}', (assert) => {
  const tokens = ['#{', '}'];
  const ast = createAst(tokens);
  assert.truthy(I.is(ast, I.Set()));
});

test('should build a Map when it encounters {}', (assert) => {
  const tokens = ['{', '}'];
  const ast = createAst(tokens);
  assert.truthy(I.is(ast, I.Map()));
});

test('should return an atom if it encounters a non collection literal', (assert) => {
  const tokens = ['a'];
  const ast = createAst(tokens);
  assert.is(ast, createAtom('a'));
});

test('should build a Stack inside a Stack when it encounters (())', (assert) => {
  const tokens = ['(', '(', ')', ')'];
  const ast = createAst(tokens);
  assert.truthy(I.is(ast, I.Stack.of(I.Stack())));
});

test('should build a List inside a List when it encounters [[]]', (assert) => {
  const tokens = ['[', '[', ']', ']'];
  const ast = createAst(tokens);
  assert.truthy(I.is(ast, I.List.of(I.List())));
});

test('should build a Set inside a Set when it encounters #{#{}}', (assert) => {
  const tokens = ['#{', '#{', '}', '}'];
  const ast = createAst(tokens);
  assert.truthy(I.is(ast, I.Set.of(I.Set())));
});

test('should build a Map inside a Map when it encounters {{} {}}', (assert) => {
  const tokens = ['{', '{', '}', '{', '}', '}'];
  const ast = createAst(tokens);
  assert.truthy(I.is(ast, I.Map.of(I.Map(), I.Map())));
});

test('should build a Stack with the element order specified in the literal', (assert) => {
  const args = ['1', '2', '3', '4'];
  const tokens = ['(', ...args, ')'];
  const ast = createAst(tokens);
  assert.truthy(I.is(ast, I.Stack(args.map(createAtom))));
});

test('should be able to build a Set with items and collections', (assert) => {
  const elements = ['1', '{', '}', '2', '3', '#{', '}', '(', ')', '5', '[', '[', '2', ']', ']'];
  const tokens = ['#{', ...elements, '}'];
  const ast = createAst(tokens);
  assert.truthy(I.is(
    ast,
    I.Set.of(
      createAtom('1'),
      I.Map(),
      createAtom('2'),
      createAtom('3'),
      I.Set(),
      I.Stack(),
      createAtom('5'),
      I.List.of(I.List.of(createAtom('2'))),
    )
  ));
});

test('should be able to build a Stack with items and collections', (assert) => {
  const elements = ['1', '{', 'a', 'b', '}', '2', '3', '#{', '}', '(', ')', '5', '[', ']'];
  const tokens = ['(', ...elements, ')'];
  const ast = createAst(tokens);
  assert.truthy(I.is(
    ast,
    I.Stack.of(
      createAtom('1'),
      I.Map.of(createAtom('a'), createAtom('b')),
      createAtom('2'),
      createAtom('3'),
      I.Set(),
      I.Stack(),
      createAtom('5'),
      I.List(),
    )
  ));
});

test('should be able to build a List with items and collections', (assert) => {
  const elements = ['1', '{', '}', '2', '3', '#{', '}', '(', '3', ')', '5', '[', ']'];
  const tokens = ['[', ...elements, ']'];
  const ast = createAst(tokens);
  assert.truthy(I.is(
    ast,
    I.List.of(
      createAtom('1'),
      I.Map(),
      createAtom('2'),
      createAtom('3'),
      I.Set(),
      I.Stack.of(createAtom('3')),
      createAtom('5'),
      I.List(),
    )
  ));
});

test('should be able to build a List with items and collections', (assert) => {
  const elements = ['1', '{', '}', '2', '3', '#{', '2', '}', '(', ')', '5', '[', ']'];
  const tokens = ['{', ...elements, '}'];
  const ast = createAst(tokens);
  assert.truthy(I.is(
    ast,
    I.Map.of(
      createAtom('1'),
      I.Map(),
      createAtom('2'),
      createAtom('3'),
      I.Set.of(createAtom('2')),
      I.Stack(),
      createAtom('5'),
      I.List(),
    )
  ));
});

test('should build a complex tree from a complex literal', (assert) => {
  const elements = ['#{', '2', '}', '5', '[', 'ten', ']', '(', '(', '#{', '4', '}', ')', ')'];
  const tokens = ['{', ...elements, '}'];
  const ast = createAst(tokens);
  assert.truthy(I.is(
    ast,
    I.Map.of(
      I.Set.of(createAtom('2')),
      createAtom('5'),
      I.List.of(createAtom('ten')),
      I.Stack.of(I.Stack.of(I.Set.of(createAtom('4')))),
    )
  ));
});

test('should throw if a map literal has an odd number of args', (assert) => {
  const elements = ['1', '3', '#{', '}'];
  const tokens = ['{', ...elements, '}'];
  assert.throws(() => createAst(tokens));
});

['\'', '`'].forEach((token) => {
  test(`should quote Stacks prefixed with ${token}`, (assert) => {
    const elements = [token, '(', '1', '2', '3', ')'];
    const ast = createAst(elements);
    assert.true(I.is(
      ast,
      I.Stack.of('quote', I.Stack.of('1', '2', '3' )),
    ));
  });

  test(`should quote Lists prefixed with ${token}`, (assert) => {
    const elements = [token, '[', '(', '2', ')', '3', ']'];
    const ast = createAst(elements);
    assert.true(I.is(
      ast,
      I.Stack.of('quote', I.List.of(I.Stack.of('2'), '3')),
    ));
  });

  test(`should quote Sets prefixed with ${token}`, (assert) => {
    const elements = [token, '#{', '[', '2', ']', '3', '}'];
    const ast = createAst(elements);
    assert.true(I.is(
      ast,
      I.Stack.of('quote', I.Set.of(I.List.of('2'), '3')),
    ));
  });

  test(`should quote Maps prefixed with ${token}`, (assert) => {
    const elements = [token, '{', '[', '2', ']', '3', '}'];
    const ast = createAst(elements);
    assert.true(I.is(
      ast,
      I.Stack.of('quote', I.Map.of(I.List.of('2'), '3')),
    ));
  });

  test(`should quote symbols prefixed with ${token}`, (assert) => {
    const elements = [token, '#{', '[', '\'', 'horse', ']', '3', '}'];
    const ast = createAst(elements);
    assert.true(I.is(
      ast,
      I.Stack.of('quote', I.Set.of(I.List.of(I.Stack.of('quote', 'horse')), '3')),
    ));
  });

  test(`should quote numbers prefixed with ${token}`, (assert) => {
    const elements = [token, '#{', '[', '\'', '1', ']', '3', '}'];
    const ast = createAst(elements);
    assert.true(I.is(
      ast,
      I.Stack.of('quote', I.Set.of(I.List.of(I.Stack.of('quote', '1')), '3')),
    ));
  });

  test(`should quote Stacks prefixed with ${token}`, (assert) => {
    const elements = [token, '(', '1', '2', '3', ')'];
    const ast = createAst(elements);
    assert.true(I.is(
      ast,
      I.Stack.of('quote', I.Stack.of('1', '2', '3' )),
    ));
  });

  test(`should throw an error when no forms follow ${token}`, (assert) => {
    const elements = [token];
    assert.throws(() => createAst(elements));
  });
});

test('should unquote numbers prefixed with ~', (assert) => {
  const elements = ['~', '1'];
  const ast = createAst(elements);
  assert.true(I.is(ast, I.Stack.of('unquote', '1')));
});

test('should unquote Sets prefixed with ~', (assert) => {
  const elements = ['~', '#{', '1', '}'];
  const ast = createAst(elements);
  assert.true(I.is(ast, I.Stack.of('unquote', I.Set.of('1'))));
});

test('should unquote Lists prefixed with ~', (assert) => {
  const elements = ['~', '[', '1', ']'];
  const ast = createAst(elements);
  assert.true(I.is(ast, I.Stack.of('unquote', I.List.of('1'))));
});

test('should unquote Stacks prefixed with ~', (assert) => {
  const elements = ['~', '(', '1', ')'];
  const ast = createAst(elements);
  assert.true(I.is(ast, I.Stack.of('unquote', I.Stack.of('1'))));
});

test('should unquote Maps prefixed with ~', (assert) => {
  const elements = ['~', '{', '1', '[', ']', '}'];
  const ast = createAst(elements);
  assert.true(I.is(ast, I.Stack.of('unquote', I.Map.of('1', I.List()))));
});

test('should throw an error when no forms follow ~', (assert) => {
  const elements = ['~'];
  assert.throws(() => createAst(elements));
});

test('should parse quote within unquote within a quote', (assert) => {
  const elements = ['`', '~', '\'', '1'];
  const ast = createAst(elements);
  assert.true(I.is(ast, I.Stack.of('quote', I.Stack.of('unquote', I.Stack.of('quote', '1')))));
});
