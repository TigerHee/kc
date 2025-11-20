/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { analyzer } from 'vite-bundle-analyzer'
import sourcemaps from 'rollup-plugin-sourcemaps';

import pkg from './package.json'

const externalDeps = [
  'scheduler',
  'react',
  'react/jsx-runtime',
  'react-dom',
  ...Object.keys(pkg.dependencies),
]

// https://vitejs.dev/config/
export default defineConfig((env) => {
  if (env.mode === 'development') {
    return {
      define: {
        'app.env': 'import.meta.env',
        _APP_: JSON.stringify('app-sdk'),
        _DEV_: "true",
      },
      root: '.',
      plugins: [
        react(),
        dts({
          rollupTypes: true,
          exclude: ['test/**/*', 'demo/**/*'],
        }),
      ],
    }
  }

  if (env.mode === 'test') {
    return {
      define: {
        'app.env': 'import.meta.env',
        'process.env.NODE_ENV': JSON.stringify('development'),
        '_DEV_': "true",
        _APP_: JSON.stringify('app-sdk'),
      },
      root: '.',
      plugins: [
        react(),
        dts({
          rollupTypes: true,
          exclude: ['test/**/*', 'demo/**/*'],
        }),
      ],
      test: {
        setupFiles: [
          './test/setup/boot.js',
        ],
        watch: true,
        globals: true,
        environment: "jsdom",
        include: ['test/**/*.test.ts', 'test/**/*.test.tsx'],
        exclude: ['dist/**', 'vite.config.ts', 'eslint.config.mjs'],
        coverage: {
          include: ['src/**/*', '!src/types.ts'],
        },
      },
    }
  }

  return {
    define: {
      'app.env': 'import.meta.env',
    },
    root: '.',
    build: {
      outDir: 'dist',
      sourcemap: true,
      lib: {
        entry: 'src/index.ts',
        name: 'app-sdk',
        fileName: (format) => `index.${format}.js`,
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        external: externalDeps,
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'jsxRuntime',
          },
        },
      },
    },
    plugins: [
      react(),
      dts({
        rollupTypes: true,
        exclude: ['test/**/*', 'demo/**/*'],
      }),
      sourcemaps(),
    ],
  }
})
