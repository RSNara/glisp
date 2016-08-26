import * as I from 'immutable';
import * as R from 'ramda';

export default function tokenize(program) {
  const [tokens, buffer] = R.reduce(buildTokens, [I.List(), ''], program);
  return tokens.push(buffer).filter(R.complement(isComment)).filter(Boolean).toJS();
}

function buildTokens([tokens, buffer], token) {
  if (isString(buffer)) {
    if (token === '"' && R.last(buffer) !== '\\') {
      return [ tokens.push(buffer + token), '' ];
    }

    if (token === '"' && R.last(buffer) === '\\') {
      return [ tokens, buffer.substring(0, buffer.length - 1) + token];
    }

    return [ tokens, buffer + token ];
  }

  if (isComment(buffer)) {
    if (token === '\n') {
      return [ tokens.push(buffer), '' ];
    }

    return [ tokens, buffer + token ];
  }

  if (token === '#') {
    return [ tokens.push(buffer), token ];
  }

  if (buffer === '#' && token === '{') {
    return [ tokens.push('#{'), '' ];
  }

  if (['{', '}', '[', ']', '(', ')'].includes(token)) {
    return [ tokens.push(buffer, token), '' ];
  }

  if (isWhitespace(token)) {
    return [ tokens.push(buffer), '' ];
  }

  return [ tokens, buffer + token ];
}

function isWhitespace(string) {
  return /(\s|,)+/.test(string);
}

function isComment(string) {
  return string.startsWith(';');
}

function isString(string) {
  return string.startsWith('"');
}
