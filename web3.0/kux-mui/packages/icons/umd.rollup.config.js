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

export default () => [
  {
    input: `src/index.js`,
    output: {
      file: `lib/umd/kux-icons.umd.js`,
      format: 'umd',
      name: '$KuxIcons',
      sourcemap: 'inline',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
    external: ['react', 'react-dom'],
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
  },
  {
    input: `src/index.js`,
    output: {
      file: `lib/umd/kux-icons.umd.min.js`,
      format: 'umd',
      name: '$KuxIcons',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
    external: ['react', 'react-dom'],
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
  },
];
