import path from 'path';

export default [
  [
    '@babel/plugin-transform-runtime',
    {
      corejs: 3,
    },
  ],
  'lodash',
  '@emotion/babel-plugin',
  [
    'register-model',
    {
      extraNamespaces: [
        {
          filename: path.resolve(__dirname, '../src/components/common/GeeTest.js'),
          namespaces: ['captcha'],
        },
      ],
      ignore: [
        'common/models',
        'ucenter/captcha',
        'common/GeeTest',
        'base/security_base',
        'components/CommonSecurity',
        'plugins/showError',
      ],
    },
  ],
  ['import', { libraryName: 'antd', libraryDirectory: 'lib', style: true }, 'antd'],
  ['import', { libraryName: '@kc/ui', style: (name) => `${name}/style.less` }, '@kc/ui'],
  [
    'import',
    {
      libraryName: '@kufox/icons',
      libraryDirectory: 'lib/components',
      camel2DashComponentName: false,
    },
    '@kufox/icons',
  ],
  [
    'import',
    {
      libraryName: '@kufox/mui',
      libraryDirectory: '/',
      camel2DashComponentName: false,
    },
    '@kufox/mui',
  ],
  [
    'import',
    {
      libraryName: '@kux/icons',
      libraryDirectory: '/',
      camel2DashComponentName: false,
    },
    '@kux/icons',
  ],
];
