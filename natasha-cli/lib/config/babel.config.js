const { dirname } = require('path');
module.exports = (option) => ({
  presets: [
    [
      require('@babel/preset-env'),
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: { version: getCorejsVersion() },
        bugfixes: true,
        loose: false,
        targets: {
          chrome: '64',
          edge: '79',
          firefox: '67',
          opera: '51',
          safari: '12'
        },
        ...option.presetEnv
      }
    ],
    [
      require('@babel/preset-react'),
      {
        runtime: 'automatic',
        development: isDev(),
        ...option.presetReact
      }
    ],
    [
      require.resolve('@babel/preset-typescript'),
      {
        allowNamespaces: true,
        allowDeclareFields: true,
        optimizeConstEnums: true
      }
    ]
  ],
  plugins: [
    require('../auto-css-module'),
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        // https://github.com/babel/babel/issues/10261
        version: require('@babel/runtime/package.json').version,
        regenerator: true,
        // 7.13 之后根据 exports 自动选择 esm 和 cjs，无需此配置
        useESModules: false,
        helpers: true,
        // Undocumented option that lets us encapsulate our runtime, ensuring
        // make sure we are using the correct version
        // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
        absoluteRuntime: dirname(
          require.resolve('@babel/runtime/package.json')
        )
      }
    ],
    require('@babel/plugin-proposal-function-bind'),
    require('@babel/plugin-proposal-export-default-from'),
    require('@babel/plugin-transform-logical-assignment-operators'),
    [require('@babel/plugin-transform-optional-chaining'), { loose: false }],
    [
      require('@babel/plugin-proposal-pipeline-operator'),
      { proposal: 'minimal' }
    ],
    [
      require('@babel/plugin-transform-nullish-coalescing-operator'),
      { loose: false }
    ],
    require('@babel/plugin-proposal-do-expressions'),
    [require('@babel/plugin-proposal-decorators'), { legacy: true }],
    require('@babel/plugin-proposal-function-sent'),
    require('@babel/plugin-transform-export-namespace-from'),
    require('@babel/plugin-transform-numeric-separator'),
    require('@babel/plugin-proposal-throw-expressions'),
    require('@babel/plugin-syntax-dynamic-import'),
    require('@babel/plugin-syntax-import-meta'),
    [require('@babel/plugin-transform-class-properties'), { loose: true }],
    [require('@babel/plugin-transform-private-methods'), { loose: true }],
    [
      require('@babel/plugin-transform-private-property-in-object'),
      { loose: true }
    ],
    require('@babel/plugin-transform-json-strings')
  ].filter(Boolean),
  compact: !isDev(),
  sourceType: 'unambiguous',
  cacheDirectory: true,
  cacheCompression: false
});

function isDev () {
  return process.env.NODE_ENV === 'development';
}

function getCorejsVersion () {
  const corejsVersion = require(require.resolve(
    'core-js/package.json'
  )).version;
  const [major, minor] = corejsVersion.split('.');
  return `${major}.${minor}`;
}
