module.exports = function (config, params) {
  config.module.rules.get('js').parser({
    system: false,
  });
  if (params.isDev) {
    const fontsRule = config.module.rule('fonts');
    fontsRule.uses.clear();
    fontsRule.use('url-loader').loader(require.resolve('@umijs/deps/compiled/url-loader')).options({
      limit: Infinity,
    });
    config.module
      .rule('media')
      .test(/\.mp(3|4)$/)
      .use('file-loader')
      .loader(require.resolve('@umijs/deps/compiled/file-loader'));
  } else {
    // MPA
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp|ico)(\?.*)?$/)
      .use('url-loader')
      .loader(require.resolve('@umijs/deps/compiled/url-loader'))
      .options({
        limit: 1024 * 8, //只有小于8kb以base64内联
        name: '[name].[hash:8].[ext]',
        esModule: false,
        fallback: {
          loader: require.resolve('@umijs/deps/compiled/file-loader'),
          options: {
            name: '[name].[hash:8].[ext]',
            outputPath: '../static/',
            publicPath: (name) => `${params.publicPathForLoader}static/${name}`,
            esModule: false,
          },
        },
      });
    config.module
      .rule('svg')
      .test(/\.(svg)(\?.*)?$/)
      .use('file-loader')
      .loader(require.resolve('@umijs/deps/compiled/file-loader'))
      .options({
        name: '[name].[hash:8].[ext]',
        outputPath: '../static/',
        publicPath: (name) => `${params.publicPathForLoader}static/${name}`,
        esModule: false,
      });
    config.module
      .rule('media')
      .test(/\.mp(3|4)$/)
      .use('file-loader')
      .loader(require.resolve('@umijs/deps/compiled/file-loader'))
      .options({
        name: '[name].[hash:8].[ext]',
        outputPath: '../static/',
        publicPath: (name) => `${params.publicPathForLoader}static/${name}`,
        esModule: false,
      });
  }
};
