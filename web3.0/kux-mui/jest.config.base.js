/**
 * Owner: victor.ren@kupotech.com
 */
module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.svg$': '<rootDir>/svgTransform.js',
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
};
