const { defineConfig } = require('rollup');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const babel = require('@rollup/plugin-babel');
const url = require('@rollup/plugin-url');
const json = require('@rollup/plugin-json');
const styles = require('rollup-plugin-styles');
const alias = require('@rollup/plugin-alias');
const { visualizer } = require('rollup-plugin-visualizer');
const terser = require('@rollup/plugin-terser');
const path = require('path');
const fs = require('fs');
const VaultPlugin = require('vault-webpack-plugin/dist/rollup-plugin-vault');
const replace = require('@rollup/plugin-replace');
const { cleanDist, generatePackageJson, copyStaticAssets, inlineScriptMinify } = require('./config/rollup-plugins.js');
const babelConfig = require('./config/babel.config.js');
const normalModuleReplacementPlugin = require('./config/rollup-plugin-replace-imports.js');
const pkg = require('./package.json');
// 收集所有要 external 的依赖
const externalDeps = [...Object.keys(pkg.peerDependencies || {}), ...Object.keys(pkg.dependencies || {})];

// 由于cdn发布目录为 dist/assets，发布后不存在assets路径，所有实际路径为 https://assets.staticimg.com/gbiz-next/xxxx.svg
const isDev = process.env.NODE_ENV === 'development';

// 由于cdn发布目录为 dist/assets，发布后不存在assets路径，所有实际路径为 https://assets.staticimg.com/gbiz-next/xxxx.svg
const assetsPrefix = isDev ? 'http://localhost:5002' : `https://assets.staticimg.com/gbiz-next`;

// 动态生成 externals 目录下的所有入口
const input = {};

// 添加主入口
input['index'] = 'src/index.ts';

// 添加 externals 目录下的所有文件作为入口
const externalsDir = path.join(__dirname, 'externals');
if (fs.existsSync(externalsDir)) {
  const externalsFiles = fs
    .readdirSync(externalsDir)
    .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'))
    .map(file => path.basename(file, path.extname(file)));

  externalsFiles.forEach(fileName => {
    input[fileName] = path.join(externalsDir, `${fileName}.ts`);
  });
}

// 分析插件配置
const getAnalyzePlugins = () => {
  const plugins = [];

  // 只在需要分析时添加插件
  if (process.env.ANALYZE === 'true' || process.env.NODE_ENV === 'production') {
    plugins.push(
      // 主要分析报告
      visualizer({
        filename: 'stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
        title: 'Bundle Analysis - Treemap',
        projectRoot: path.resolve(__dirname),
      })
    );
  }

  return plugins;
};
module.exports = defineConfig({
  input,
  output: [
    {
      dir: 'dist',
      format: 'es',
      entryFileNames: 'esm/[name].js',
      chunkFileNames: 'esm/[name].[hash].chunk.js',
      sourcemap: isDev,
      exports: 'named',
      compact: process.env.NODE_ENV === 'production',
      globals: {
        this: 'this',
      },
      assetFileNames: assetInfo => {
        if (assetInfo.name.endsWith('.css')) {
          return '[name].css';
        }
      },
    },
    // {
    //   dir: 'dist',
    //   format: 'cjs',
    //   entryFileNames: 'cjs/[name].js',
    //   chunkFileNames: 'cjs/[name].[hash].chunk.js',
    //   sourcemap: false,
    //   exports: 'named',
    //   compact: process.env.NODE_ENV === 'production',
    //   globals: {
    //     this: 'this',
    //   },
    //   // assetFileNames: assetInfo => {
    //   //   if (assetInfo.name.endsWith('.css')) {
    //   //     return '[name].css';
    //   //   }
    //   // },
    // },
  ],
  external: id => {
    // path-to-regexp 2.x 版本api变更，后续升级到3.x版本
    if (id === 'path-to-regexp') {
      return false;
    }
    // package.json 中的依赖
    if (externalDeps.some(dep => id === dep || id.startsWith(`${dep}/`))) {
      return true;
    }

    if (
      id === 'react' ||
      id === 'react-dom' ||
      id.startsWith('react/') || // react/jsx-runtime 等
      id.startsWith('react-dom/') ||
      id.startsWith('@opentelemetry/') ||
      id.startsWith('@sentry') ||
      id.startsWith('kc-next') ||
      id.startsWith('next-i18next') ||
      id === 'axios' ||
      id.startsWith('@emotion') ||
      id.startsWith('@kux/mui-next') ||
      id.startsWith('lodash-es') ||
      id.startsWith('qs') ||
      id.startsWith('dayjs') ||
      id.startsWith('next') ||
      id.startsWith('@kux/mui')
    ) {
      return true;
    }

    return false;
  },
  plugins: [
    // 自定义插件
    cleanDist(),
    inlineScriptMinify(),
    // 路径别名配置
    alias({
      entries: {
        // '@': path.resolve(__dirname, './src'),
        tools: path.resolve(__dirname, './src/tools'),
        packages: path.resolve(__dirname, './src/packages'),
        hooks: path.resolve(__dirname, './src/hooks'),
        provider: path.resolve(__dirname, './src/provider'),
        styles: path.resolve(__dirname, './src/styles'),
        locales: path.resolve(__dirname, './src/locales'),
        '@transfer': path.resolve(__dirname, './src/packages/transfer/src'),
        kycCompliance: path.resolve(__dirname, './src/packages/kyc/src/components/Compliance'),
      },
    }),

    // 解析 node_modules 中的模块
    resolve({
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      preferBuiltins: false,
    }),

    // 将 CommonJS 模块转换为 ES6
    commonjs(),

    // 处理 JSON 文件
    json(),

    // TypeScript 支持
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
      exclude: ['**/__tests__/**'],
      sourceMap: isDev,
      removeComments: process.env.NODE_ENV === 'production',
    }),
    // Babel 转换
    babel(babelConfig),

    replace({
      preventAssignment: true,
      values: {
        'process.env.LEGACY': JSON.stringify(false),
      },
    }),

    normalModuleReplacementPlugin(),

    // 处理 CSS/SCSS
    styles({
      include: ['src/packages/header/**/*.scss'],
      mode: ['extract', 'Header.css'],
      autoModules: true,
      minimize: true,
      use: ['sass'],
      sourceMap: false, // CSS sourcemap
      vars: true, // 支持CSS变量
      includePaths: [path.resolve(__dirname, './src')],
      config: {
        // Sass 配置，添加路径别名支持
        includePaths: [path.resolve(__dirname, './src')],
      },
      plugins: [fixCssUrls()],
    }),
    styles({
      include: ['src/packages/footer/**/*.scss'],
      mode: ['extract', 'Footer.css'],
      autoModules: true,
      minimize: true,
      use: ['sass'],
      sourceMap: false, // CSS sourcemap
      vars: true, // 支持CSS变量
      includePaths: [path.resolve(__dirname, './src')],
      config: {
        // Sass 配置，添加路径别名支持
        includePaths: [path.resolve(__dirname, './src')],
      },
      plugins: [fixCssUrls()],
    }),
    styles({
      include: ['src/packages/entrance/**/*.scss'],
      mode: ['extract', 'entrance.css'],
      autoModules: true,
      minimize: true,
      use: ['sass'],
      sourceMap: false, // CSS sourcemap
      vars: true, // 支持CSS变量
      includePaths: [path.resolve(__dirname, './src')],
      config: {
        // Sass 配置，添加路径别名支持
        includePaths: [path.resolve(__dirname, './src')],
      },
      plugins: [fixCssUrls()],
    }),
    styles({
      exclude: ['src/packages/header/**/*.scss', 'src/packages/footer/**/*.scss', 'src/packages/entrance/**/*.scss'],
      mode: 'inject',
      // CSS Modules 配置
      modules: {
        auto: true,
        // auto: (id) => id.endsWith('.module.css') || id.endsWith('.module.scss'),
        // generateScopedName: '[name]__[local]--[hash:base64:5]',
        generateScopedName: (localName, resourcePath) => {
          // 获取文件名（不含扩展名）
          const fileName = path.basename(resourcePath).replace(/\.\w+$/, '');

          // 移除 .module 部分（如果存在）
          const cleanFileName = fileName.replace('.module', '');

          // 生成哈希值
          const hash = require('crypto')
            .createHash('md5')
            .update(resourcePath + localName)
            .digest('base64')
            .substr(0, 5)
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

          // 返回自定义格式
          return `${cleanFileName}__${localName}--${hash}`;
        },
      },
      use: ['sass'],
      sourceMap: false, // CSS sourcemap
      vars: true, // 支持CSS变量
      includePaths: [path.resolve(__dirname, './src')],
      config: {
        // Sass 配置，添加路径别名支持
        includePaths: [path.resolve(__dirname, './src')],
      },
      plugins: [fixCssUrls()],
    }),

    // 兼容 node_modules ESM 中的 ?url / ?inline 资源导入（如 @kux/design）
    // 将 xxx.ext?query 在解析阶段重写为 xxx.ext，让 url 插件接管处理
    {
      name: 'strip-asset-query',
      async resolveId(source, importer) {
        if (/\.(svg|png|jpe?g|gif|mp3|json|woff2?|ttf|eot|webp)\?(?:url|inline).*$/i.test(source)) {
          const cleaned = source.replace(/\?.*$/, '');
          const res = await this.resolve(cleaned, importer, { skipSelf: true });
          if (res) return res;
          return cleaned;
        }
        return null;
      },
    },

    // 处理静态资源
    url({
      limit: 4 * 1024, // 4KB
      include: [/\.(svg|png|jpe?g|gif|mp3|json|woff2?|ttf|eot|webp)(\?.*)?$/i],
      fileName: '[name].[hash][extname]',
      publicPath: `${assetsPrefix}/`,
    }),

    // 自定义插件
    generatePackageJson(),
    copyStaticAssets(),
    // vault
    VaultPlugin(),

    // 分析插件
    ...getAnalyzePlugins(),
  ].filter(Boolean),
});

function fixCssUrls(options = {}) {
  return {
    postcssPlugin: 'fix-css-urls',
    Declaration(decl) {
      if (decl.value.includes('url(')) {
        // 替换所有 url(xxx) 为 url(gbiz-next/assets/xxx)
        decl.value = decl.value.replace(/url\(['"]?(.*?)['"]?\)/g, (match, url) => {
          if (url.startsWith('data:')) return match; // 跳过 Base64
          const filename = url.split('/').pop();
          return `url("${assetsPrefix}/${filename}")`;
        });
      }
    },
  };
}
