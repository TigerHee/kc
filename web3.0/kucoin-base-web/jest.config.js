module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^src/(.*)': '<rootDir>/src/$1',
    '^shared/(.*)': '<rootDir>/src/shared/$1',
    '^utils/(.*)': '<rootDir>/src/utils/$1',
  },
  verbose: true, // 是否输出 descripe 和 test/it 中的测试描述信息
  silent: false,
  globals: {
    _DEV_: true,
    _APP_NAME_: 'kucoin-base-web',
    _APP_: 'kucoin-base-web',
    _VERSION_: '0.0.1',
    _XVERSION_: '0.0.1',
    CMS_CDN: 'xxx.xxx',
    // IS_TEST_ENV: true,
    _ENV_: 'prod',
    // _DEV_: 'env',
    SENTRY_DEBUG: false,
  },
  // setupFilesAfterEnv: [
  //   '@testing-library/react-hooks/disable-error-filtering.js',
  //   'reflect-metadata',
  // ], // 在每个测试文件执行之前调用一些默认执行代码的文件路径
  // testEnvironment: 'jsdom',
  setupFiles: ['./test/setupFile.js'],
  collectCoverageFrom: [
    // 覆盖率收集路径
    '<rootDir>/src/utils/**/*.js',
    '!<rootDir>/src/utils/loadJson.js',
    '!<rootDir>/src/utils/serviceWorker.js',
    '!<rootDir>/src/utils/abTest/api.js',
    '!<rootDir>/src/utils/abTest/index.js',
    '!<rootDir>/src/utils/sensors.js',
  ],
};
