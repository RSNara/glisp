import * as I from 'immutable';
import createParenMap from './create-paren-map';
import createAtom from './create-atom';
import * as Util from './util/index';

export default function createAst(tokens) {
  const endingParen = createParenMap(tokens);

  return build(0)[0];

  // TODO: Reimplement so JavaScript can do tail call optimization
  function build(i) {
    const token = tokens[i];
    const end = endingParen[i];

    if (token === '(') {
      return [ buildSeq(I.List(), i, end, i + 1), end + 1 ];
    }

    if (token === '#{') {
      return [ buildSeq(I.Set(), i, end, i + 1), end + 1 ];
    }

    if (token === '{') {
      return [ buildMap(I.Map(), i, end, i + 1), end + 1 ];
    }

    return [ createAtom(token), i + 1 ];
  }

  function buildSeq(seq, start, end, i) {
    if (end === i) {
      return seq;
    }

    const [ object, next ] = build(i);
    return buildSeq(
      Util.conj(seq, object),
      start,
      end,
      next,
    );
  }

  function buildMap(map, start, end, i) {
    if (end === i) {
      return map;
    }

    const [ key, valueIndex ] = build(i);

    if (valueIndex >= end) {
      throw new Error('Map expects an even number of arguments');
    }

    const [ value, next ] = build(valueIndex);

    return buildMap(
      Util.conj(map, [ key, value ]),
      start,
      end,
      next
    );
  }
}
