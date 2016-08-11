import * as Util from './util/index';

const ErrorFactories = {
  DetectedUnendedParens: (stack) => new Error(
    `Detected unclosed starting parens ${serializeStack(stack)}`
  ),

  DetectedIllegalEndingParen: (start, end) => new Error(
    `Starting paren ${start} is followed by an illegal instance of ${end}`
  ),

  DetectedNoStartingParens: (end, expectedParens) => new Error(
    `Detected ending paren ${end} but no matching ${Util.serializeArray(expectedParens)}`
  ),
};

export default function createParenMap(tokens) {
  const stack = [];
  const map = {};

  for (const [index, token] of tokens.entries()) {
    if (Util.isStartingParen(token)) {
      stack.push({ index, paren: token });
    } else if (Util.isEndingParen(token)) {
      const endingParen = token;
      const matchingStartingParens = Util.getMatchingStartingParens(endingParen);

      if (stack.length === 0) {
        throw ErrorFactories.DetectedNoStartingParens(endingParen, matchingStartingParens);
      }

      const top = stack.pop();

      if (! matchingStartingParens.includes(top.paren)) {
        throw ErrorFactories.DetectedIllegalEndingParen(top.paren, endingParen);
      }

      map[top.index] = index;
    }
  }

  if (stack.length !== 0) {
    throw ErrorFactories.DetectedUnendedParens(stack);
  }

  return map;
}

function serializeStack(stack) {
  return Util.serializeArray(stack.map(Util.serializeArray));
}
