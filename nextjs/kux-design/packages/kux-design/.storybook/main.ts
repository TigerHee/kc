import remarkGfm from 'remark-gfm';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite'
import { join, dirname } from 'path';
/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: [
    '../docs/**/*.@(mdx|md)',
    '../src/**/*.@(mdx|md)',
    '../src/**/stories.@(js|jsx|mjs|ts|tsx)',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-themes'),
    {
      name: getAbsolutePath('@storybook/addon-coverage'),
      options: {
        istanbul: {
          include: ['**/stories/**'],
          // exclude: ['**/exampleDirectory/**'],
        },
      }
    },
    {
      name: getAbsolutePath('@storybook/addon-docs'),
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    }
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {
    },
  },
  docs: {
    defaultName: 'API'
  },
  core: {
    disableTelemetry: true,
    builder: getAbsolutePath('@storybook/builder-vite'),
  },
  features: {
    interactions: false, // 禁用交互功能
  },
  // 文档的静态资源目录
  staticDirs: ['./public'],
  viteFinal: async (config) => {
    return mergeConfig(config, {
      envPrefix: ['REACT_', 'NGINX_'],
      define: {
        'process.env.BUILD_TIME': JSON.stringify(
          new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
        ),
      },
      // 设置构建时使用相对路径
      base: './',
      build: {
        sourcemap: false,
        rollupOptions: {
          output: {
            // 设置输出的文件名格式
            entryFileNames: 'assets/[name].[hash].js',
            chunkFileNames: 'assets/[name].[hash].js',
            assetFileNames: 'assets/[name].[hash].[ext]',
          },
        }
      },
    });
  },
};



export default config;
