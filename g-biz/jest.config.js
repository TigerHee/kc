const babelConfig = require('./babel.config');
const { merge } = require('lodash');
const packageJson = require('./package.json');

const babelConfigCopy = merge({}, babelConfig, {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: 'auto'
      },
    ]
  ]
});

module.exports = {
  // 测试文件的路径模式（相当于 `--testPathPattern`）
  // 其他子包里的测试跑不通，按需加
  testMatch: [
    "<rootDir>/packages/verification/**/*.test.js",
    "<rootDir>/packages/syncStorage/**/*.test.js",
  ],
  moduleNameMapper: {
    '^lodash-es/(.*)$': 'lodash/$1',
    '^@tools/(.*)$': '<rootDir>/externals/tools/$1',
    '^@utils$': '<rootDir>/externals/utils/index.js',
    '^@utils/(.*)$': '<rootDir>/externals/utils/$1',
    '^@kux/mui/styled$': '<rootDir>/node_modules/@emotion/styled',
    '^@kux/mui/keyframes$': '<rootDir>/node_modules/@kux/mui/node/emotion/keyframes',
    '^@kux/mui/(use.*)$': '<rootDir>/node_modules/@kux/mui/node/hooks/$1',
    '^@kux/mui/(.*)$': '<rootDir>/node_modules/@kux/mui/node/$1',
    '^@kux/icons/(.*)$': '<rootDir>/node_modules/@kux/icons/node/$1'
  },
  // 设置环境为 jsdom（模拟浏览器环境，默认情况下 Jest 使用 jsdom）
  testEnvironment: "jsdom",
  // 增强 Jest 断言的库（相当于 `@testing-library/jest-dom`）
  setupFilesAfterEnv: [
    "@testing-library/jest-dom", // 引入 Jest DOM 扩展
  ],
  // 指定 transform 选项，处理 Babel 编译（相当于 `babel-jest`）
  transform: {
    // 对 JS 和 JSX 文件使用 babel-jest 进行转换
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      babelConfigCopy
    ],
    // 转换图片文件和字体文件
    '\\.(png|jpg|jpeg|gif|webp|bmp|svg|eot|ttf|woff|woff2)$': '<rootDir>/jest.custom-transform.js',
  },
  globals: {
    __public_path__: 'https://assets.staticimg.com/g-biz/externals/',
    __version__: packageJson.version
  },
  // 测试覆盖率配置
  collectCoverage: true,  // 开启覆盖率收集
  // 其他 Jest 配置项
  verbose: true,   // 打印更详细的测试运行信息
  // 支持 jsx 和 tsx 文件
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  setupFilesAfterEnv: ['./jest.setup.js']
};
