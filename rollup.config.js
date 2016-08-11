import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  dest: 'lib/index.js',
  format: 'umd',
  moduleName: 'GLISP',
  plugins: [
    babel({
      babelrc: false,
      presets: ['es2015-rollup', 'stage-0'],
      exclude: 'node_modules/**',
    }),
  ],
  external: [
    'immutable',
    'ramda',
    'mathjs',
    'iterall',
  ],
  globals: {
    immutable: 'Immutable',
    ramda: 'R',
    mathjs: 'math',
    iterall: 'iterall',
  },
};
