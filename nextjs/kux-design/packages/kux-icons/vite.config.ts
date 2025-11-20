import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig((env) => ({
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      exclude: ['scripts/**', 'demo/**'], // 排除 scripts 和 demo 目录
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(env.mode || 'development'),  
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    lib: {
      entry: {
        index: resolve(__dirname, 'src', 'index.tsx'),
        'icon-map': resolve(__dirname, 'src', 'icon-map.tsx'),
      },
      name: 'MkIcons',
      formats: ['es', 'cjs'],
      fileName: (format, entry) => `${entry}.${format}.js`,
    },
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      output: {
        // 避免默认的 .mjs 后缀 导致 webpack 无法识别
        chunkFileNames() {
          return '[name]-[hash].js'
        },
      },
      external: [
        'react',
        'react/jsx-runtime',
        'scheduler',
      ],
    },
  },
  // 新增：开发时以 demo 为根目录
  root: env.command === 'serve' ? resolve(__dirname, 'demo') : undefined,
  publicDir: env.command === 'serve' ? resolve(__dirname, 'public') : undefined,
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    open: true,
  },
}));
