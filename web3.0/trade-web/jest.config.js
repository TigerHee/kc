const _ = require('lodash');

const { XVersion = '' } = process.env;

module.exports = {
  verbose: true,
  moduleFileExtensions: ['js', 'jsx', 'json'],
  transform: {
    '^.+\\.js$': '<rootDir>/jestPreprocess.js',
    '^.+\\.(svg|png)$': '<rootDir>/jestSvgTransform.js', // https://stackoverflow.com/questions/46791263/jest-svg-require-causes-syntaxerror-unexpected-token
  },
  rootDir: './',
  modulePaths: ['<rootDir>/'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^src/(.*)': '<rootDir>/src/$1',
    '^helper$': '<rootDir>/src/helper.js',
    '^@/(.*)': '<rootDir>/src/trade4.0/$1',
    '^@mui/(.*)': '<rootDir>/src/trade4.0/components/mui/$1',
    '^config$': '<rootDir>/_tests_/_mock_/config.js',
    // '\\.(css|less|png)$': 'identity-obj-proxy',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|mp3)$': 'identity-obj-proxy',
    // '^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    // FIXME: 执行时间过长删除这个mock，通过安装依赖解决 @kufox/mui 跟 @kufox/icons 不存在的问题
    '^@kufox/mui': '<rootDir>/_tests_/_mock_/kufoxMui.js',
    '^@kucoin-biz/sentry$': '<rootDir>/_tests_/_mock_/sentry.js',
    '^@kucoin-base/(.*)$': '<rootDir>/_tests_/_mock_/@kucoin-base/$1.js',
    '^@kucoin-biz/(.*)$': '<rootDir>/_tests_/_mock_/@kucoin-biz/$1.js',
    '^@kux/mui': '<rootDir>/node_modules/@kux/mui/node/index.js',
    '^@kux/icons': '<rootDir>/node_modules/@kux/icons/node/index.js',
    '^.+\\.svg$': 'jest-svg-transformer',
    '^rc-(.*)/es': 'rc-$1/lib',
    '^Bot/(.*)': '<rootDir>/src/trade4.0/pages/Bot/$1',
    '^lodash-es/(.*)': '<rootDir>/node_modules/lodash/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!(@kux/(mui|icons))/)'],
  collectCoverageFrom: [
    'src/trade4.0/pages/Bot/helper.js',
    'src/trade4.0/pages/Bot/Strategies/ClassicGrid/util.js',
    'src/trade4.0/pages/Bot/Strategies/FutureGrid/util.js',
    'src/trade4.0/pages/Bot/Strategies/InfinityGrid/util.js',
    'src/trade4.0/pages/Bot/Strategies/SmartTrade/util.js',
    'src/trade4.0/pages/Bot/Strategies/AiSpotTrend/util.js',
    'src/trade4.0/pages/Bot/Strategies/AiFutureTrend/util.js',
    '!src/components/KCSvgIcon.js',
  ],
  testEnvironment: 'jsdom',
  globals: {
    _XVERSION_: 'xxx',
    _DEV_: true,
    _IS_SANDBOX_: false,
    _APP_NAME_: 'trade-web',
    _VERSION_: 'xxx',
    _PUBLIC_PATH_: 'https://assets.staticimg.com/',
    _RELEASE_: '_RELEASE_',
  },
  setupFiles: ['<rootDir>/_tests_/test-setup.js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
};
