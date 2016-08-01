import tokenize from './tokenize';
import createAST from './create-ast';

export default function parse(program) {
  return createAST(tokenize(program));
}
