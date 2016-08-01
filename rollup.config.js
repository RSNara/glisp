import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  dest: 'lib/index.js',
  format: 'umd',
  moduleName: 'GLISP',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  external: [
    'immutable',
    'ramda',
    'mathjs',
  ],
  globals: {
    immutable: 'Immutable',
    ramda: 'R',
    mathjs: 'math',
  },
};
