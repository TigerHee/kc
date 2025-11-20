module.exports = {
  preset: '@testing-library/react-native',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@@/(.*)$': '<rootDir>/src/.umi/$1',
    '^src/(.*)': '<rootDir>/src/$1',
    '^config/(.*)': '<rootDir>/src/config/$1',
    '^config': '<rootDir>/src/config/index.js',
    '^utils/(.*)': '<rootDir>/src/utils/$1',
    '^hooks/(.*)': '<rootDir>/src/hooks/$1',
    '^static/(.*)': '<rootDir>/cdnAssets/static/$1',
    '^routes/(.*)': '<rootDir>/src/routes/$1',
    '^components/(.*)': '<rootDir>/src/components/$1',
    '^common/(.*)': '<rootDir>/src/common/$1',
    '^services/(.*)': '<rootDir>/src/services/$1',
    '^site/(.*)': '<rootDir>/src/site/$1',
  },
  verbose: true, // 是否输出 describe 和 test/it 中的测试描述信息
  globals: {
    _DEV_: true,
    _APP_NAME_: 'kucoin_copytrading_rn',
    CMS_CDN: 'xxx.xxx',
    IS_TEST_ENV: true,
  },
  // 在每个测试文件执行之前调用一些默认执行代码的文件路径
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transform: {
    '^.+\\.js': 'babel-jest',
    '^.+\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
  transformIgnorePatterns: [
    // eslint-disable-next-line max-len
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@miblanchard/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@krn(/)?/.*|hex-rgb|@emotion/.*)',
  ],
  clearMocks: true,
  setupFiles: ['./jest.setup.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    // 覆盖率收集路径
    '<rootDir>/src/utils/**/*.js',
    '<rootDir>/src/hooks/**/*.js',
    '<rootDir>/src/components/**/*.js',
  ],
  // 关键排除项
  testPathIgnorePatterns: ['/node_modules/'], // 仅控制测试执行
  coveragePathIgnorePatterns: [
    // 控制覆盖率统计
    '/node_modules/',
    '<rootDir>/src/components/ScrollableTabView/.*', // 递归排除子目录
    '<rootDir>/src/components/copyTradeComponents/.*',
    '<rootDir>/src/utils/models',
    '<rootDir>/src/components/PullToRefresh',
    '<rootDir>/src/components/AdjustLeverageSelect',
    '<rootDir>/src/components/GlobalModal',
    '<rootDir>/src/components/Common/SvgIcon.js',
  ],
};
