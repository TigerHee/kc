const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getPostCssConfig = require('./postcss.config');

const configCSSRule = (mode, rule, options = {}) => {
  const { cssModules = false, less = false } = options;
  const cssModulesOptions = cssModules
    ? { localIdentName: '[local]_[hash:base64:5]' }
    : false;

  const sourceMap = mode === 'development';
  const preLoaderCount = less ? 2 : 1;

  const newRule = rule
    .use('MiniCssExtractPlugin.loader')
    .loader(MiniCssExtractPlugin.loader)
    .options({
      esModule: false
    })
    .end()
    .use('css-loader')
    .loader(require.resolve('css-loader'))
    .options({
      importLoaders: preLoaderCount,
      sourceMap,
      url: {
        filter: (url) => {
          return !url.startsWith('/');
        }
      },
      modules: cssModulesOptions
    })
    .end()
    .use('postcss-loader')
    .loader(require.resolve('postcss-loader'))
    .options({
      sourceMap,
      postcssOptions: {
        config: false,
        ...(getPostCssConfig())
      }
    })
    .end();

  if (less) {
    newRule.use('less-loader')
      .loader(require.resolve('less-loader'))
      .options({
        sourceMap,
        lessOptions: {
          javascriptEnabled: true,
          math: 'always'
        }
      });
  }
};

const configAssetsRule = (config, type, testReg, loaderOpts = {}) => {
  config.module.rule(type).test(testReg)
    .set('type', 'asset')
    .set('generator', {
      dataUrl: loaderOpts
    })
    .set('parser', {
      dataUrlCondition: {
        maxSize: 8 * 1024 // 8kb
      }
    });
};

module.exports = (config, mode) => {
  // css https://juejin.cn/post/6844904083321520142
  const cssRule = config.module.rule('css').test(/\.css/);
  configCSSRule(mode, cssRule.oneOf('css-modules').resourceQuery(/modules/), { cssModules: true });
  configCSSRule(mode, cssRule.oneOf('normal'));

  const lessRule = config.module.rule('less').test(/\.less/);
  configCSSRule(mode, lessRule.oneOf('css-modules').resourceQuery(/modules/), { cssModules: true, less: true });
  configCSSRule(mode, lessRule.oneOf('normal'), { less: true });

  // assets rules
  [
    ['woff2', /\.woff2?$/, { mimetype: 'application/font-woff' }],
    ['ttf', /\.ttf$/, { mimetype: 'application/octet-stream' }],
    ['eot', /\.eot$/, { mimetype: 'application/vnd.ms-fontobject' }],
    // ['svg', /\.svg$/, { mimetype: 'image/svg+xml' }],
    ['img', /\.(png|jpg|webp|jpeg|gif)$/i],
    ['mp3', /\.mp3$/]
  ].forEach(([type, reg, opts]) => {
    configAssetsRule(config, type, reg, opts || {});
  });

  // svg
  config.module
    .rule('svgr')
    .test(/\.svg$/)
    .issuer(/\.[jt]sx?$/)
    .use('svgr')
    .loader(require.resolve('@svgr/webpack'))
    .options({
      prettier: false,
      svgo: false,
      svgoConfig: {
        plugins: [{ removeViewBox: false }]
      },
      titleProp: true,
      ref: true
    })
    .end()
    .use('file-loader')
    .loader(require.resolve('file-loader'))
    .options({
      name: 'static/media/[name].[hash:8].[ext]'
    })
    .end();
};
