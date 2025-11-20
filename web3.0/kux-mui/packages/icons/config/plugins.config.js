/**
 * Owner: victor.ren@kupotech.com
 */
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
// import url from '@rollup/plugin-url';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import path from 'path';
import babelConfig from './babel.config';

export default [
  alias({
    entries: {
      components: path.resolve(__dirname, './src/components'),
      utils: path.resolve(__dirname, './src/utils'),
      themes: path.resolve(__dirname, './src/themes'),
      context: path.resolve(__dirname, './src/context'),
      hooks: path.resolve(__dirname, './src/hooks'),
      hocs: path.resolve(__dirname, './src/hocs'),
      styles: path.resolve(__dirname, './src/styles'),
      emotion: path.resolve(__dirname, './src/emotion'),
      config: path.resolve(__dirname, './src/config'),
    },
  }),
  babel({
    babelHelpers: 'runtime',
    exclude: 'node_modules/**',
    ...babelConfig,
  }),
  resolve({ preferBuiltins: true }),
  commonjs(),
  image(),
  // url(),
  json(),
];
