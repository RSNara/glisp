import * as I from 'immutable';
import * as R from 'ramda';
/* eslint no-console: 0 */

export default function tokenize(program) {
  const state = {
    shouldReadNewToken: true,
  };
  const { tokens, isReadingString } = R.reduce(createTokens, state, program);

  if (isReadingString) {
    throw new Error('Never finished reading string');
  }

  return tokens.filter(R.complement(isComment)).filter(Boolean).toJS();
}

function appendToLast(list, str) {
  console.assert(list.count() > 0, 'List should not be empty');
  return list.butLast().push(list.last() + str);
}

function appendSpecialCharacter(state, token) {
  const specialCharacter = {
    '"': '"',
    'n': '\n',
    'r': '\r',
    't': '\t',
    '\\': '\\',
  }[token] || token;
  return {
    ...state,
    tokens: appendToLast(state.tokens, specialCharacter),
    isReadingSpecialCharacter: false,
  };
}

const DELIMITERS = ['{', '}', '[', ']', '(', ')'];

function createTokens(state, token) {
  const {
    tokens = I.List(),
    isReadingString = false,
    isReadingDispatch = false,
    isReadingComment = false,
    isReadingSpecialCharacter = false,
    shouldReadNewToken = false,
  } = state;

  if (shouldReadNewToken) {
    if (isWhitespace(token)) {
      return {
        tokens,
        shouldReadNewToken: true,
      };
    }

    return {
      tokens: tokens.push(token),
      isReadingDispatch: token === '#',
      isReadingString: token === '"',
      isReadingComment: token === ';',
      shouldReadNewToken: DELIMITERS.includes(token),
    };
  }

  if (isReadingString) {
    if (isReadingSpecialCharacter) {
      return appendSpecialCharacter(state, token);
    }

    if (token === '\\') {
      return {
        ...state,
        isReadingSpecialCharacter: true,
      };
    }

    if (token === '"') {
      return {
        ...state,
        tokens: appendToLast(tokens, '"'),
        isReadingString: false,
        shouldReadNewToken: true,
      };
    }

    return {
      ...state,
      tokens: appendToLast(tokens, token),
    };
  }

  if (isReadingComment) {
    if (token === '\n') {
      return {
        ...state,
        isReadingComment: false,
        shouldReadNewToken: true,
      };
    }

    return {
      ...state,
      tokens: appendToLast(tokens, token),
    };
  }

  if (isReadingDispatch) {
    if (isWhitespace(token)) {
      return {
        ...state,
        isReadingDispatch: false,
        shouldReadNewToken: true,
      };
    }

    return {
      ...state,
      tokens: appendToLast(tokens, token),
      shouldReadNewToken: DELIMITERS.includes(token),
    };
  }

  if (isWhitespace(token)) {
    return {
      tokens,
      shouldReadNewToken: true,
    };
  }

  if ([...DELIMITERS, '#', '"', ';'].includes(token)) {
    return {
      tokens: tokens.push(token),
      isReadingDispatch: token === '#',
      isReadingString: token === '"',
      isReadingComment: token === ';',
      shouldReadNewToken: DELIMITERS.includes(token),
    };
  }

  return {
    ...state,
    tokens: appendToLast(tokens, token),
  };
}

function isWhitespace(string) {
  return /(\s|,)+/.test(string);
}

function isComment(string) {
  return string.startsWith(';');
}
