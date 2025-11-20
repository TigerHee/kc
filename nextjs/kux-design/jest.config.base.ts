import type { Config } from '@jest/types';

/**
 * jest 的基础配置
 */
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // 按 describe-test 结构展示信息
  verbose: true,
  // 是否输出 log 信息
  silent: true,
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  // 默认启动的时候执行的 setup，用于 global mock 等，子仓库引入，不添加 env 构建使用 js 文件
  setupFiles: ['<rootDir>/jest-env.ts'],
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        // 忽略 ts type 检查，快速执行 ut，可以切换
        isolatedModules: true,
      }
    ],
  },
  moduleNameMapper: {
    '\\.json': 'json5-jest',
    '\\.(css|sass|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)': 'jest-transform-stub',
    '^@/(.*)$': '<rootDir>/src/$1',
  }
};

export default config;
