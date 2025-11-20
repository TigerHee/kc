/* eslint-disable @typescript-eslint/no-require-imports */
const { withKcNextConfig } = require('kc-next/withKcNextConfig');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const { withSentryConfig } = require('@sentry/nextjs');
const { IS_DEV } = require('kc-next/env');
const { assetPrefix, cdnPrefix, appName } = require('./constant.config');
const splitChunks = require('./splitChunks');
const { KuxCssPlugin } = require('@kux/design/plugin-next');

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
    additionalData: `$asset-prefix: "${assetPrefix || ''}"; @import "@kux/design/style";`,
  },
  reactStrictMode: false,
  images: {
    loader: 'custom',
    loaderFile: './plugins/imageLoader.ts',
    disableStaticImages: true,
  },
  webpack: (config, { isServer, webpack }) => {
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
      test: /\.(mp4|webm|ogg|swf|ogv)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]',
          outputPath: 'static/media/',
        },
      },
    });

    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp|avif)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]', // 输出文件名格式
            outputPath: 'static/media/', // 输出路径
          },
        },
      ],
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
        debug: IS_DEV,
      })
    );
    return config;
  },
  experimental: {
    // 启用更激进的优化
    optimizePackageImports: [
      '@kux/design',
      '@kux/iconpack',
      '@kux/mk-design',
      '@kux/mui-next',
      '@kux/mui',
      '@kux/icons',
      'dayjs',
      'html-to-react',
      'htmlparser2',
      'clsx'
    ],
  },
  transpilePackages: ['rc-util', 'rc-picker', 'rmc-picker'],
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
