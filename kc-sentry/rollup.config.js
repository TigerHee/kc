/**
 * Owner: iron@kupotech.com
 */
const { dirname } = require('path');
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const ensureArray = (maybeArr) =>
  Array.isArray(maybeArr) ? maybeArr : [maybeArr];

const externals = Object.keys(pkg.dependencies || {});

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`);
  return (id) => pattern.test(id);
};

function getCorejsVersion() {
  const corejsVersion = require(require.resolve(
    "core-js/package.json"
  )).version;
  const [major, minor] = corejsVersion.split(".");
  return `${major}.${minor}`;
}

const getBabelOptions = ({ useESModules, umd }, targets) => ({
  babelrc: false,
  exclude: 'node_modules/**',
  babelHelpers: 'runtime',
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: umd ? 'usage' : false,
        corejs: { version: getCorejsVersion() },
        bugfixes: true,
        targets,
      },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        // https://github.com/babel/babel/issues/10261
        version: require('@babel/runtime/package.json').version,
        useESModules,
        // make sure we are using the correct version
        // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
        absoluteRuntime: dirname(
          require.resolve('@babel/runtime/package.json')
        ),
      },
    ],
  ],
});

const createConfig = ({
  output,
  umd = false,
  cjs = false,
  targets,
  env,
} = {}) => {
  const min = env === 'production';

  return {
    input: 'src/index.js',
    output: ensureArray(output).map((format) =>
      Object.assign({}, format, {
        name: '$KcSentry',
        exports: 'named',
      })
    ),
    external: makeExternalPredicate(umd ? [] : externals),
    plugins: [
      resolve({
        jsnext: true,
      }),
      commonjs(),
      babel(getBabelOptions({ useESModules: !cjs, umd }, targets)),
      replace({
        preventAssignment: true,
        values: {
          _VERSION_: JSON.stringify(pkg.version),
        },
      }),
      min && terser(),
    ],
  };
};

const browserTargets = {
  chrome: '64',
  edge: '79',
  firefox: '67',
  opera: '51',
  safari: '12',
};

const configs = {
  cjs: {
    output: { file: pkg.main, format: 'cjs' },
    cjs: true,
    targets: { node: 'current' },
  },
  esm: {
    output: { file: pkg.module, format: 'esm'},
    targets: {
      esmodules: true,
    },
  },
  umd_prod: {
    output: { file: pkg.unpkg.replace(/\.min\.js$/, '.js'), format: 'umd' },
    umd: true,
    env: 'development',
    targets: browserTargets,
  },
  umd: {
    output: { file: pkg.unpkg, format: 'umd' },
    umd: true,
    env: 'production',
    targets: browserTargets,
  },
};

const buildTypes = Object.keys(configs);

export default buildTypes.map((type) => createConfig(configs[type]));
