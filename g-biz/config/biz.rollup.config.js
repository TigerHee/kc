/**
 * Owner: iron@kupotech.com
 */
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import babelConfig from './babel.config';

const entries = ['index.js', 'componentsBundle.js'];

export default entries.map((input) => ({
  input: `src/${input}`,
  output: [
    {
      file: `lib/${input}`,
      format: 'cjs',
      sourcemap: true,
      exports: 'auto',
      plugins: [
        visualizer({
          gzipSize: true,
          filename: `stats/${input}.stats.cjs.html`,
        }),
      ],
    },
    {
      file: `es/${input}`,
      format: 'esm',
      sourcemap: true,
      plugins: [
        visualizer({
          gzipSize: true,
          filename: `stats/${input}.stats.esm.html`,
        }),
      ],
    },
  ],
  plugins: [
    peerDepsExternal({
      includeDependencies: true,
    }),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      ...babelConfig,
    }),
    resolve({ preferBuiltins: true }),
    commonjs(),
    copy({
      targets: [
        {
          src: 'src/locale',
          dest: 'lib',
        },
        {
          src: 'src/locale',
          dest: 'es',
        },
        {
          src: 'src/assets',
          dest: 'lib',
        },
        {
          src: 'src/assets',
          dest: 'es',
        },
      ],
    }),
    terser(),
    image(),
    json(),
  ],
}));
