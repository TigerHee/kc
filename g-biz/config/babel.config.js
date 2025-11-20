/**
 * Owner: iron@kupotech.com
 */
export default {
  'presets': [
    [
      '@babel/preset-env',
      {
        'loose': true,
        'targets': {
          'browsers': ['> 1%', 'last 2 versions', 'not ie <= 8'],
        },
      },
    ],
    '@babel/react',
  ],
  'plugins': [
    'lodash',
    [
      'import',
      {
        'libraryName': '@kc/mui',
        'libraryDirectory': 'lib/components',
        'camel2DashComponentName': false,
      },
    ],
    [
      '@babel/proposal-decorators',
      {
        'legacy': true,
      },
    ],
    '@babel/proposal-class-properties',
    '@babel/external-helpers',
    '@babel/transform-runtime',
  ],
};
