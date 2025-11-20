import path from 'path';

export default [
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
];
