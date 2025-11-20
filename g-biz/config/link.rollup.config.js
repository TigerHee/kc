/**
 * Owner: iron@kupotech.com
 */
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import babelConfig from './babel.config';

const entries = ['index.js'];

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
    terser(),
  ],
}));
