module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-react': {
          runtime: 'automatic',
        },
      },
    ],
  ],
  plugins: [
    [
      'import',
      {
        libraryName: '@kux/mui-next',
        libraryDirectory: '',
        camel2DashComponentName: false,
        style: false,
      },
      '@kux/mui-next',
    ],
    // 处理 @kux/icons 按需加载
    [
      'import',
      {
        libraryName: '@kux/icons',
        libraryDirectory: '',
        camel2DashComponentName: false,
        style: false,
      },
      '@kux/icons',
    ],
    // 处理 lodash-es 按需加载
    [
      'import',
      {
        libraryName: 'lodash-es',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'lodash-es',
    ],
    // 处理 dayjs 按需加载
    [
      'import',
      {
        libraryName: 'dayjs',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'dayjs',
    ],
    // 处理 dayjs 插件按需加载
    [
      'import',
      {
        libraryName: 'dayjs/plugin',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'dayjs-plugin',
    ],
  ],
};
