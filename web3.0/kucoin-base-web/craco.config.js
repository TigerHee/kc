const { override, addWebpackExternals, addWebpackAlias } = require('customize-cra');
const systemjsInterop = require('systemjs-webpack-interop/webpack-config');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { whenDev, whenProd } = require('@craco/craco');
const interpolateHtml = require('craco-interpolate-html-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');
const tapWebpackPlugin = require('./config/tapWebpackPlugin');
const addEntry = require('./config/addEntry');
const pkg = require('./package.json');
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { WebpackAPIMockToolbar } = require('@kc/mk-plugin-mock')
const SriWebpackManifestProcessorPlugin = require('./plugins/SriWebpackManifestProcessorPlugin')

const { REACT_APP_CDN, NODE_ENV } = process.env;

const errorReportFilePath = path.resolve(__dirname, './config/errorReport.js');
const errorReportCode = fs.readFileSync(errorReportFilePath, 'utf-8');

const siteArg = process.argv.find((arg) => arg.indexOf('site=') !== -1);
const site = siteArg ? siteArg.slice(5) : 'main';

const frameworkImportMaps = {
  imports: {
    react: `${REACT_APP_CDN}/natasha/npm/react@17.0.2/umd/react.${NODE_ENV === 'development' ? 'development.js' : 'production.min.js'
      }`,
    'react-dom': `${REACT_APP_CDN}/natasha/npm/react-dom@17.0.2/umd/react-dom.${NODE_ENV === 'development' ? 'development.js' : 'production.min.js'
      }`,
    'react-router-dom': `${REACT_APP_CDN}/natasha/npm/react-router-dom@5.3.4/umd/react-router-dom.${NODE_ENV === 'development' ? 'js' : 'min.js'
      }`,
    'react-redux': `${REACT_APP_CDN}/natasha/npm/react-redux@8.0.5/dist/react-redux.${NODE_ENV === 'development' ? 'js' : 'min.js'
      }`,
    'lottie-web': `${REACT_APP_CDN}/natasha/npm/lottie-web@5.10.0/build/player/lottie.min.js`,
    '@emotion/react': `${REACT_APP_CDN}/natasha/npm/@emotion/react@11.4.1/dist/emotion-react.umd.min.js`,
    '@emotion/styled': `${REACT_APP_CDN}/natasha/npm/@emotion/styled@11.3.0/dist/emotion-styled.umd.min.js`,
    'connected-react-router': `${REACT_APP_CDN}/natasha/npm/connected-react-router@6.9.3/umd/ConnectedReactRouter.min.js`,
    '@kufox/mui': `${REACT_APP_CDN}/natasha/npm/@kufox/mui@2.5.14.patch/umd/kufox-mui.umd.min.js`,
    'charting-library-master': `${process.env.NODE_ENV === 'development' ? '' : '/kucoin-base-web'
      }/charting_library_master/charting_library.min.js`,
    'trade_charting-library-master': `${process.env.NODE_ENV === 'development' ? '' : '/kucoin-base-web'
      }/charting_library_1.14/charting_library.min.js`,
    futures_charting_library_master: `${process.env.NODE_ENV === 'development' ? '' : '/kucoin-base-web'
      }/futures_charting_library_master/charting_library.min.js`,
    '@kc/report': `${REACT_APP_CDN}/natasha/npm/@kc/report@2.2.10/dist/lib.min.js`,
  },
  integrity: process.env.NODE_ENV === 'development' ? {
    'https://assets.staticimg.com/natasha/npm/react@17.0.2/umd/react.development.js': 'sha384-xQwCoNcK/7P3Lpv50IZSEbJdpqbToWEODAUyI/RECaRXmOE2apWt7htari8kvKa/',
    'https://assets.staticimg.com/natasha/npm/react-dom@17.0.2/umd/react-dom.development.js': 'sha384-E9IgxDsnjKgh0777N3lXen7NwXeTsOpLLJhI01SW7idG046SRqJpsW2rJwsOYk0L',
    'https://assets.staticimg.com/natasha/npm/react-router-dom@5.3.4/umd/react-router-dom.js': 'sha384-C8xizycOgoUjqtrGEb88Xl6igPFsfUUfPZD8MXbMlyDOOi2YOeuxLMbfVslf3YSm',
    'https://assets.staticimg.com/natasha/npm/react-redux@8.0.5/dist/react-redux.js': 'sha384-rQogdo3JEG5NSQ/lYHFqquXmbgrs+KSHHx9Fsprwe2ydEJ8C55SSI6m1u4cZHF0C',
    'https://assets.staticimg.com/natasha/npm/lottie-web@5.10.0/build/player/lottie.min.js': 'sha384-E1/GDB9/Ut5spEcCrRaN+VoieprV8CB/Xel0pad51o8v96K68/QU/dBrb3LhZ0eq',
    'https://assets.staticimg.com/natasha/npm/@emotion/react@11.4.1/dist/emotion-react.umd.min.js': 'sha384-wUsjrQg6/7izkxOOm4mBkGtfj5x2GfSURlL3BWVSVi1FdGw0O3h/4rbq4LGL4sfX',
    'https://assets.staticimg.com/natasha/npm/@emotion/styled@11.3.0/dist/emotion-styled.umd.min.js': 'sha384-YdqXNHJ6x+wucbOEkxxCUESYlSenIVgoETOxCxdrdhz4JZHYnQhlD+Tr6HwKIjZi',
    'https://assets.staticimg.com/natasha/npm/connected-react-router@6.9.3/umd/ConnectedReactRouter.min.js': 'sha384-b/3DkvBNiN5M3i8qEkE8jQRWE0sDxJM78rejKA9NMGpHD8z+/rI4AqnCd91nJYfx',
    'https://assets.staticimg.com/natasha/npm/@kufox/mui@2.5.14.patch/umd/kufox-mui.umd.min.js': 'sha384-iuCkcaIzp9oW35mNdSS84hdCnCBE5Eqebg3Vlb4a3iBcBD+htwzPv65CFXp1L+Nj',
    '/charting_library_master/charting_library.min.js': 'sha384-fbRQeNIWvVtX51sL/bpw1zSX3TCQ5X1pdJQluPyLxPVNbSaSywRZ3oTeMD09JtRv',
    '/charting_library_1.14/charting_library.min.js': 'sha384-T40Kyx+lXW6ejvgtnd4KhQqrESFaK4I8VGsullczeCpAneubthg/e7m1lnHVC7ne',
    '/futures_charting_library_master/charting_library.min.js': 'sha384-d3v29VN0Vvsrmgg/oYKxIhVtBNE5Je+YxbCFFZmehfH4c29yPkOG6St7/iHRNRK5',
  } : {
    'https://assets.staticimg.com/natasha/npm/react@17.0.2/umd/react.production.min.js': 'sha384-7Er69WnAl0+tY5MWEvnQzWHeDFjgHSnlQfDDeWUvv8qlRXtzaF/pNo18Q2aoZNiO',
    'https://assets.staticimg.com/natasha/npm/react-dom@17.0.2/umd/react-dom.production.min.js': 'sha384-vj2XpC1SOa8PHrb0YlBqKN7CQzJYO72jz4CkDQ+ePL1pwOV4+dn05rPrbLGUuvCv',
    'https://assets.staticimg.com/natasha/npm/react-router-dom@5.3.4/umd/react-router-dom.min.js': 'sha384-sqCFPXhp/7Wo/GpdeGi0bU7NFbOFjKiNv3uTyfPe7niUeor+9qqLVtmnqy5QZ4Zl',
    'https://assets.staticimg.com/natasha/npm/react-redux@8.0.5/dist/react-redux.min.js': 'sha384-XzftbK9kzCD9k/G9px+1GC6lDuhBUhQmtBubWHJoLwxxpLeKarKSx9xJpVhJnNlG',
    'https://assets.staticimg.com/natasha/npm/lottie-web@5.10.0/build/player/lottie.min.js': 'sha384-E1/GDB9/Ut5spEcCrRaN+VoieprV8CB/Xel0pad51o8v96K68/QU/dBrb3LhZ0eq',
    'https://assets.staticimg.com/natasha/npm/@emotion/react@11.4.1/dist/emotion-react.umd.min.js': 'sha384-wUsjrQg6/7izkxOOm4mBkGtfj5x2GfSURlL3BWVSVi1FdGw0O3h/4rbq4LGL4sfX',
    'https://assets.staticimg.com/natasha/npm/@emotion/styled@11.3.0/dist/emotion-styled.umd.min.js': 'sha384-YdqXNHJ6x+wucbOEkxxCUESYlSenIVgoETOxCxdrdhz4JZHYnQhlD+Tr6HwKIjZi',
    'https://assets.staticimg.com/natasha/npm/connected-react-router@6.9.3/umd/ConnectedReactRouter.min.js': 'sha384-b/3DkvBNiN5M3i8qEkE8jQRWE0sDxJM78rejKA9NMGpHD8z+/rI4AqnCd91nJYfx',
    'https://assets.staticimg.com/natasha/npm/@kufox/mui@2.5.14.patch/umd/kufox-mui.umd.min.js': 'sha384-iuCkcaIzp9oW35mNdSS84hdCnCBE5Eqebg3Vlb4a3iBcBD+htwzPv65CFXp1L+Nj',
    '/kucoin-base-web/charting_library_master/charting_library.min.js': 'sha384-fbRQeNIWvVtX51sL/bpw1zSX3TCQ5X1pdJQluPyLxPVNbSaSywRZ3oTeMD09JtRv',
    '/kucoin-base-web/charting_library_1.14/charting_library.min.js': 'sha384-T40Kyx+lXW6ejvgtnd4KhQqrESFaK4I8VGsullczeCpAneubthg/e7m1lnHVC7ne',
    '/kucoin-base-web/futures_charting_library_master/charting_library.min.js': 'sha384-d3v29VN0Vvsrmgg/oYKxIhVtBNE5Je+YxbCFFZmehfH4c29yPkOG6St7/iHRNRK5',
    // @kc/report 会进行混淆，所以这里不做校验
  }
};

if (process.env.NODE_ENV === 'production') {
  process.env.PUBLIC_URL = `${process.env.REACT_APP_CDN}`;
}

function generate(seed, files) {
  const importMap = {
    imports: {},
    depcache: {},
    integrity: {},
  };

  let mainFilePath = '';
  const depcache = [
    frameworkImportMaps.imports.react,
    frameworkImportMaps.imports['react-dom'],
    frameworkImportMaps.imports['react-router-dom'],
    frameworkImportMaps.imports['react-redux'],
    frameworkImportMaps.imports['connected-react-router'],
    frameworkImportMaps.imports['@emotion/react'],
    frameworkImportMaps.imports['@emotion/styled'],
  ];

  files.forEach((file) => {
    if (file.isChunk && file.isInitial && file.chunk) {
      if (/\.js$/.test(file.name)) {
        importMap.imports[`@kucoin-base/${file.chunk.name}`] = file.path;
        if (file.chunk.name === 'main') {
          mainFilePath = file.path;
        } else {
          depcache.push(file.path);
        }
      }
      if (/\.css$/.test(file.name)) {
        importMap.imports[`@kucoin-base/${file.chunk.name}@css`] = file.path;
      }
    }
  });

  importMap.depcache[mainFilePath] = depcache;

  return importMap;
}

const htmlMinifyOption = {
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  },
};

module.exports = {
  eslint: {
    mode: 'file',
  },
  plugins: [
    {
      plugin: interpolateHtml,
      options: {
        frameworkImportMaps: JSON.stringify(frameworkImportMaps),
        errorReportCode: `<script>${errorReportCode}</script>`,
      },
    },
  ],
  devServer: {
    devMiddleware: {
      index: site === 'main' ? 'index.html' : `index_${site}.html`,
    },
  },
  webpack: {
    babel: {
      plugins: ['lodash'],
    },
    plugins: {
      add: [
        new WebpackManifestPlugin({
          publicPath: process.env.NODE_ENV === 'development' ? '/' : process.env.REACT_APP_CDN,
          generate,
          fileName: `import-map.json`,
        }),
        // 需要在 WebpackManifestPlugin 之后
        new SriWebpackManifestProcessorPlugin({
          inputManifestFileName: 'import-map.json',
          outputFileName: 'import-map.json',
        }),
        new HtmlWebpackPlugin(
          Object.assign(
            {},
            {
              template: path.resolve(__dirname, './public/index_tr.html'),
              filename: 'index_tr.html',
            },
            whenProd(() => htmlMinifyOption),
          ),
          'prepend',
        ),
        new HtmlWebpackPlugin(
          Object.assign(
            {},
            {
              template: path.resolve(__dirname, './public/index_th.html'),
              filename: 'index_th.html',
            },
            whenProd(() => htmlMinifyOption),
          ),
          'prepend',
        ),
        new HtmlWebpackPlugin(
          Object.assign(
            {},
            {
              template: path.resolve(__dirname, './public/index_cl.html'),
              filename: 'index_cl.html',
            },
            whenProd(() => htmlMinifyOption),
          ),
          'prepend',
        ),
        new HtmlWebpackPlugin(
          Object.assign(
            {},
            {
              template: path.resolve(__dirname, './public/index_au.html'),
              filename: 'index_au.html',
            },
            whenProd(() => htmlMinifyOption),
          ),
          'prepend',
        ),
        new HtmlWebpackPlugin(
          Object.assign(
            {},
            {
              template: path.resolve(__dirname, './public/index_eu.html'),
              filename: 'index_eu.html',
            },
            whenProd(() => htmlMinifyOption),
          ),
          'prepend',
        ),
        new HtmlWebpackPlugin(
          Object.assign(
            {},
            {
              template: path.resolve(__dirname, './public/index_demo.html'),
              filename: 'index_demo.html',
            },
            whenProd(() => htmlMinifyOption),
          ),
          'prepend',
        ),
        new WebpackAPIMockToolbar(),
      ],
    },
    configure: (webpackConfig, { env, paths }) => {
      const systemjsWebpackConfig = systemjsInterop.modifyWebpackConfig(webpackConfig);

      systemjsWebpackConfig.output.uniqueName = pkg.name;
      systemjsWebpackConfig.output.devtoolNamespace = pkg.name;
      // 处理测试覆盖率 参考 https://k-devdoc.atlassian.net/wiki/spaces/develop/pages/426379139/Web
      systemjsWebpackConfig.output.devtoolModuleFilenameTemplate = (info) => {
        const _path = path.relative(process.cwd(), info.absoluteResourcePath).replace(/\\/g, '/');
        // 和nolan review代码时发现sourcemap产物中 stylis-rtl.ts的路径处理后还是会出现相对路径，会产生warning。固特殊处理为绝对路径保持一致。
        if (_path.includes('src/stylis-rtl.ts')) {
          return _path.replace('../', '');
        }
        return _path;
      };
      paths.appBuild = systemjsWebpackConfig.output.path = path.resolve(__dirname, 'dist');
      webpackConfig.optimization.runtimeChunk = 'single';

      systemjsWebpackConfig.ignoreWarnings = [
        {
          message: /stylis-rtl/,
        },
      ];

      whenDev(() => {
        webpackConfig.output.filename = '[name].build.js';
      });

      whenProd(() => {
        webpackConfig.output.chunkFilename = `${pkg.name}/${pkg.version}/js/[name].[contenthash:8].chunk.js`;
        webpackConfig.output.filename = `${pkg.name}/${pkg.version}/js/[name].[contenthash:8].chunk.js`;
        if (process.env.ANALYZE) {
          webpackConfig.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: 'server',
              analyzerPort: 8890,
              openAnalyzer: true,
            }),
          );
        }
      });

      return override(
        addEntry('history', path.resolve(__dirname, './src/shared/history.js')),
        addEntry('storage', path.resolve(__dirname, './src/shared/storage.js')),
        addEntry('kcStorage', path.resolve(__dirname, './src/shared/kcStorage.js')),
        addEntry('syncStorage', path.resolve(__dirname, './src/shared/syncStorage.js')),
        addEntry('dva', path.resolve(__dirname, './src/shared/store/createDva.js')),
        addEntry('fetch', path.resolve(__dirname, './src/shared/fetch.js')),
        addEntry('i18n', path.resolve(__dirname, './src/shared/i18n.js')),
        addEntry('report', path.resolve(__dirname, './src/shared/report.js')),
        addEntry('bridge', path.resolve(__dirname, './src/shared/bridge.js')),
        addEntry('sensors', path.resolve(__dirname, './src/shared/sensors.js')),
        addEntry('kunlun', path.resolve(__dirname, './src/shared/kunlun.js')),
        tapWebpackPlugin('HtmlWebpackPlugin', {
          inject: false,
          // inject: true,
        }),
        addWebpackAlias({
          '@': path.resolve(__dirname, './src'),
          '@pages': path.resolve(__dirname, './src/pages'),
          '@utils': path.resolve(__dirname, './src/utils'),
          '@components': path.resolve(__dirname, './src/components'),
          '@config': path.resolve(__dirname, './src/config'),
          '@layouts': path.resolve(__dirname, './src/layouts'),
          '@apps': path.resolve(__dirname, './src/apps'),
        }),
        addWebpackExternals([
          'react',
          'react-dom',
          'react-router-dom',
          'react-router-config',
          'react-redux',
          '@emotion/react',
          '@emotion/styled',
          'connected-react-router',
          '@kc/report',
          /@kucoin-base/,
          /@kucoin-biz/,
          'lottie-web',
          /@kucoin-gbiz-next/,
        ]),
      )(systemjsWebpackConfig, env);
    },
  },
};
