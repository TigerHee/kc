/**
 * Owner: iron@kupotech.com
 */
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import fs from 'fs';
import path from 'path';
import babelConfig from './babel.config';

const inputs = fs.readdirSync(path.resolve(process.cwd(), 'src'));

export default inputs.map((input) => ({
  input: `src/${input}`,
  output: [
    {
      file: `lib/${input}`,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: `es/${input}`,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      ...babelConfig,
    }),
    peerDepsExternal({
      includeDependencies: true,
    }),
    terser(),
    resolve(),
    commonjs(),
  ],
}));
