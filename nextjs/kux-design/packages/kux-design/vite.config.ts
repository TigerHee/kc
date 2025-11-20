/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import svgr from 'vite-plugin-svgr'
import pkg from './package.json'
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets'
import copy from 'rollup-plugin-copy';
// 获取 kux-icon 组件库版本
import kuxIconPkg from '@kux/iconpack/package.json';

const isDev = process.env.BUILD_MODE !== 'build';

const externalDeps = [
  'react',
  'react/jsx-runtime',
  'scheduler',
  'react-dom',
  /stories\.tsx?$/,
  /\/third-lib\/.*/,
  // 避免打包 motion 相关的依赖
  'motion/react',
  ...Object.keys(pkg.dependencies),
]

export default defineConfig((env) =>  {
  return {
    root: './',
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['import'],
          api: 'modern',
        },
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(env.mode),
      /**
       * 组件库版本号
       */
      'process.env.PKG_VERSION': JSON.stringify(pkg.version),
      /**
       * KUX Icon 组件库版本号
       */
      'process.env.KUX_ICON_PKG_VERSION': JSON.stringify(kuxIconPkg.version),
      /**
       * 是否为本地开发环境
       */
      '_DEV_': JSON.stringify(isDev),
    },
    plugins: [
      react(),
      svgr({
        include: /.*\.svg\?react$/
      }),
      dts({
        rollupTypes: true,
        exclude: '**/*stories.(tsx|ts)',
      }),
      libAssetsPlugin({
        limit: 1024 * 2,
        name: '[name].[contenthash:6].[ext][query]',
        include: [
          /\.(png|jpe?g|gif|webp|svg)$/i,
          /\.(png|jpe?g|gif|webp|svg|json)\?url$/i,
        ],
      }),
      {
        // 监控构建成功事件
        name: 'on-build-finish',
        closeBundle() {
          // 生成 scss 便捷引入文件, 第三方可以通过 @import '@kux/design/style' 引入
          ensureStyleEntry()
        }
      }
    ],
    build: {
      sourcemap: true,
      lib: {
        entry: 'src/index.ts',
        name: 'kuxDesign',
        fileName: (format) => `index.${format}.js`,
        formats: ['es', 'cjs'],
      },
      outDir: 'dist',
      rollupOptions: {
        external: externalDeps,
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'style.css';
            }
            return 'assets/[name].[hash][extname]';
          },
          // 避免默认的 .mjs 后缀 导致 webpack 无法识别
          chunkFileNames() {
            return '[name]-[hash].js'
          },
        },
        plugins: [
          copy({
            targets: [
              {
                // index.scss 及 style.scss 会产生css代码, 不需要复制
                src: ['src/style/*', '!src/style/index.scss', '!src/style/style.scss'],
                dest: 'dist/style',
              }
            ],
            hook: 'writeBundle'
          })
        ]
      }
    },
    test: {
      setupFiles: [
        './test/setup.ts',
      ],
      watch: true,
      globals: true,
      environment: 'jsdom',
      include: [
        'test/**/*.test.{ts,tsx}',
        'src/**/*.test.{ts,tsx}',
        'src/**/test.{ts,tsx}'
      ],
      exclude: ['dist/**', 'vite.config.ts', 'eslint.config.mjs'],
      coverage: {
        include: ['src/**/*', '!src/types.ts'],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    }
  }
})


/**
 * 生成 scss 便捷引入文件, 第三方可以通过 @import '@kux/design/style' 引入
 */
function ensureStyleEntry() {
  const styleContent = '@forward \'../dist/style/common.scss\';';
  const stylePath = path.join(__dirname, 'style/index.scss');
  fs.mkdirSync(path.dirname(stylePath), { recursive: true });
  fs.writeFileSync(stylePath, styleContent, { encoding: 'utf-8' });
}
