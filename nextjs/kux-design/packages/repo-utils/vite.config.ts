import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { builtinModules } from 'module'

/**
 * get all node builtins
 */
const nodeBuiltins = builtinModules.filter((module) => !module.startsWith('_'))

// https://vitejs.dev/config/
export default defineConfig((env) => {
  return {
    esbuild: {
      platform: 'node',
      target: 'node16',
    },
    plugins: [
      react(),
      dts({
        rollupTypes: true,
        exclude: '**/*stories.(tsx|ts)',
      }),
    ],
    define: {
      'process.env.NODE_ENV': JSON.stringify(env.mode),
      // eslint-disable-next-line no-undef
      '_DEV_': process.env.BUILD ? 'false' : 'true',
    },
    build: {
      minify: false,
      lib: {
        entry: 'src/index.ts',
        fileName: (format) => `index.${format}.js`,
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        external: [
          ...nodeBuiltins,
          'react',
          'react/jsx-runtime',
          /rollup/,
          /babel/,
          /core-js/,
        ],
        output: {
          globals: {
            react: 'React',
          },
        },
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    }
  }
})
