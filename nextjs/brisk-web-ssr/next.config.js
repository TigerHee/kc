/* eslint-disable @typescript-eslint/no-require-imports */
const { withKcNextConfig } = require('kc-next/withKcNextConfig');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const { withSentryConfig } = require('@sentry/nextjs');
const { assetPrefix, cdnPrefix, appName } = require('./constant.config');
const { KuxCssPlugin } = require('@kux/design/plugin-next');
const splitChunks = require('./splitChunks');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_APP_NAME: appName,
    NEXT_PUBLIC_ASSET_PREFIX: assetPrefix,
    NEXT_PUBLIC_CDN_PREFIX: cdnPrefix,
    NEXT_PUBLIC_SPA: process.env.NEXT_PUBLIC_SPA,
    NEXT_PUBLIC_BRAND_SITE: process.env.NEXT_PUBLIC_BRAND_SITE,
  },
  // redirects: () => {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/home',
  //       permanent: false,
  //     },
  //   ];
  // },
  assetPrefix,
  sassOptions: {
    // 向sass文件追加 @kux/design 的 sass 工具, 这样不用每个sass文件都import
    // 详细使用说明请参考 https://kux.sit.kucoin.net/next/?path=/docs/5-sass-%E4%B8%8E%E5%B7%A5%E5%85%B7%E6%A0%B7%E5%BC%8F--api
    additionalData: `$asset-prefix: "${assetPrefix || ''}"; @import "@kux/design/style";`,
  },
  reactStrictMode: false,
  images: {
    loader: 'custom',
    disableStaticImages: true,
    loaderFile: './plugins/imageLoader.ts',
  },
  webpack: (config, options) => {
    const { isServer, webpack, dev } = options;
    if (dev) {
      // 扩展监控路径
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /^((?:[^/]*(?:\/|$))*)(\.(git|next))(\/((?:[^/]*(?:\/|$))*)(?:$|\/))?/,
        followSymlinks: true, // 启用符号链接跟踪
      };

      // 强制重新编译依赖包
      config.snapshot = {
        ...config.snapshot,
        managedPaths: [/^(.+?[\\/]node_modules[\\/])(?!gbiz-next)/],
      };
    }

    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        async_hooks: false,
      };

      // 拆包
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: splitChunks,
      };
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false, // 保留 viewBox 属性
                    },
                  },
                },
              ],
            },
          },
        },
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]', // 输出文件名格式
            outputPath: 'static/media/', // 输出路径
          },
        },
      ],
    });

    // 添加对 MP4 等视频文件的处理
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|swf|ogv|png|jpe?g|gif|mp3|woff2?|ttf|eot|webp)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]',
          outputPath: 'static/media/',
        },
      },
    });

    // 添加 webpack 插件
    config.plugins.push(
      // 处理 @kux/mui-next 按需加载
      new webpack.NormalModuleReplacementPlugin(/@kux\/mui-next/, resource => {
        // 处理 hooks 按需加载
        if (resource.request.match(/\/use/)) {
          resource.request = resource.request.replace('@kux/mui-next', '@kux/mui-next/hooks');
        }
      }),
      // 优化环境变量
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        __SENTRY_DEBUG__: false, // 移除调试代码
        __SENTRY_TRACING__: true, // 移除追踪代码（若无需追踪功能）
        __RRWEB_EXCLUDE_IFRAME__: true, // 移除iframe捕获代码（若无需会话重放或不记录iframe）
        __RRWEB_EXCLUDE_SHADOW_DOM__: true, // 移除Shadow DOM捕获代码
        __SENTRY_EXCLUDE_REPLAY_WORKER__: true, // 移除重放压缩Worker（需自定义Worker时使用）
      }),
      new KuxCssPlugin({
        // 启用调试模式, 会在控制台输出调试信息
        // debug: process.env.NODE_ENV === 'development',
      })
    );
    return config;
  },
  experimental: {
    // 启用更激进的优化
    optimizePackageImports: [
      '@kux/design',
      '@kux/iconpack',
      '@kux/icons',
      '@kux/mui-next',
      'lodash-es',
      'dayjs',
      'clsx',
      '@kux/mk-design',
      'rc-picker',
      'rmc-picker',
      'rc-util',
    ],
  },
};

module.exports = withSentryConfig(withBundleAnalyzer(withKcNextConfig(nextConfig)), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options
  silent: !process.env.CI,
  disableLogger: true,
  sourcemaps: {
    deleteSourcemapsAfterUpload: false,
  },
});
