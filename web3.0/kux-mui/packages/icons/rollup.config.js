/**
 * Owner: victor.ren@kupotech.com
 */
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import image from '@rollup/plugin-image';
import svgr from '@svgr/rollup';
import url from '@rollup/plugin-url';
import glob from 'glob';
import path from 'path';

import rimraf from 'rimraf';

rimraf(path.resolve(__dirname, './lib'), (err) => {
  if (err) {
    console.log('remove lib error', err);
  }
});

const entries = glob.sync('src/components/*.js');
const index = glob.sync('src/index.js');

const _entries = [...entries, ...index];

const external = _entries.map((input) => {
  return path.resolve(__dirname, input);
});

const isDev = process.env.NODE_ENV !== 'production';

export default _entries.map((input) => {
  input = input.replace('src/', '');
  const inputFile = isDev ? input : input.replace('components/', '');
  return {
    input: `src/${input}`,
    output: [
      {
        file: `lib/${inputFile}`,
        format: 'esm',
        exports: 'auto',
      },
      {
        file: `lib/node/${inputFile}`,
        format: 'cjs',
        exports: 'auto',
      },
    ],
    plugins: [
      peerDepsExternal({
        includeDependencies: true,
      }),
      babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
        presets: [
          [
            '@babel/preset-env',
            {
              loose: true,
            },
          ],
          ['@babel/preset-react'],
        ],
        plugins: [
          ['@babel/plugin-transform-runtime'],
          ['@babel/plugin-proposal-decorators', { 'legacy': true }],
          ['@babel/plugin-proposal-class-properties', { 'loose': true }],
        ],
      }),
      resolve({ preferBuiltins: true }),
      commonjs(),
      image(),
      url(),
      svgr({ ref: true }),
    ],
    external: [...external],
  };
});
