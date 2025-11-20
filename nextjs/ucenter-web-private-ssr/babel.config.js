module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-react': {
          runtime: 'automatic',
          importSource: '@emotion/react',
        },
      },
    ],
  ],
  plugins: [
    [
      require.resolve('./babel-plugins/babel-plugin-auto-dva-register.js'),
      {
        includeRegex: '/src/',
      },
    ],
    // 服务端自动注入所有 model
    require.resolve('./babel-plugins/babel-plugin-auto-dva-server-models.js'),
    ['@babel/plugin-proposal-decorators', { version: 'legacy' }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
    [
      '@emotion/babel-plugin',
      {
        autoLabel: 'dev-only',
        labelFormat: '[local]',
        cssPropOptimization: true,
      },
    ],
  ],
};
