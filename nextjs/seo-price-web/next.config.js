/* eslint-disable @typescript-eslint/no-require-imports */
const { withKcNextConfig } = require("kc-next/withKcNextConfig");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const { withSentryConfig } = require("@sentry/nextjs");
const { i18nConfig, assetPrefix, cdnPrefix, appName } = require("./constant.config");
const { KuxCssPlugin } = require('@kux/design/plugin-next');

const splitChunks = require("./splitChunks");

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  output: "standalone",
  i18n: {
    ...i18nConfig,
    localeDetection: false,
  },
  transpilePackages: ['rc-util', 'rc-picker', 'rmc-picker'],
  env: {
    NEXT_PUBLIC_APP_NAME: appName,
    NEXT_PUBLIC_ASSET_PREFIX: assetPrefix,
    NEXT_PUBLIC_CDN_PREFIX: cdnPrefix,
    NEXT_PUBLIC_SPA: process.env.NEXT_PUBLIC_SPA,
    NEXT_PUBLIC_BRAND_SITE: process.env.NEXT_PUBLIC_BRAND_SITE,
  },
  redirects: () => {
    return [
      {
        source: "/",
        destination: "/price",
        permanent: false,
      },
    ];
  },
  assetPrefix,
  sassOptions: {
    additionalData: `$asset-prefix: "${assetPrefix || ''}"; @import "@kux/design/style";`,
  },
  reactStrictMode: false,
  images: {
    loader: "custom",
    loaderFile: "./plugins/imageLoader.ts",
    disableStaticImages: true,
  },
  webpack: (config, { isServer, dev, webpack }) => {
    if (!dev) {
      // 禁用 CSS source map
      config.devtool = false
    }

    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        async_hooks: false,
      };

      // 拆包
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: splitChunks,
      };
    }

    // SVG ReactComponent 处理
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
        },
        {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]", // 输出文件名格式
            outputPath: "static/media/", // 输出路径
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp|avif)$/i,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]", // 输出文件名格式
            outputPath: "static/media/", // 输出路径
          },
        },
      ],
    });

    // 添加 webpack 插件
    config.plugins.push(
      // 处理 @kux/mui-next 按需加载
      new webpack.NormalModuleReplacementPlugin(
        /@kux\/mui-next/,
        (resource) => {
          // 处理 hooks 按需加载
          if (resource.request.match(/\/use/)) {
            resource.request = resource.request.replace(
              "@kux/mui-next",
              "@kux/mui-next/hooks"
            );
          }
        }
      ),
      // 优化环境变量
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        __SENTRY_DEBUG__: false, // 移除调试代码
        __SENTRY_TRACING__: true, // 移除追踪代码（若无需追踪功能）
        __RRWEB_EXCLUDE_IFRAME__: true, // 移除iframe捕获代码（若无需会话重放或不记录iframe）
        __RRWEB_EXCLUDE_SHADOW_DOM__: true, // 移除Shadow DOM捕获代码
        __SENTRY_EXCLUDE_REPLAY_WORKER__: true, // 移除重放压缩Worker（需自定义Worker时使用）
      })
    );

    config.plugins.push(
      new KuxCssPlugin({
        // 需要分析的组件库包名, 默认  ['@kux/design', '@kux/mk-design']
        // pkgs: string[]
        // css 注入的目标文件路径，默认 'src/pages/_app.tsx'
        // targetFile?: string;
        // 启用调试模式, 会在控制台输出调试信息, 查看 css 文件分析过程及结果
        // debug: process.env.NODE_ENV === 'development',
      }),
    );

   if (!dev) {
      // 遍历 CSS loader 配置，关闭 CSS source map
      config.module.rules.forEach(rule => {
        if (Array.isArray(rule.oneOf)) {
          rule.oneOf.forEach(one => {
            if (Array.isArray(one.use)) {
              one.use.forEach(u => {
                if (u.loader?.includes('css-loader') && u.options) {
                  u.options.sourceMap = false;
                }
              });
            }
          });
        }
      });
   }


    return config;
  },
  experimental: {
    serverSourceMaps: false, // 禁用服务器端源映射
    // 启用更激进的优化
    optimizePackageImports: [
      "@kux/mui-next",
      "@kux/icons",
      // "@kc/tdk",
      "lodash-es",
      "dayjs",
      "clsx",
      '@kux/design',
      '@kux/iconpack',
      '@kux/mk-design',
    ],
  },
};

module.exports = withSentryConfig(
  withBundleAnalyzer(withKcNextConfig(nextConfig)),
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options
    silent: !process.env.CI,
    disableLogger: true,
    sourcemaps: {
      deleteSourcemapsAfterUpload: false,
    },
  }
);
