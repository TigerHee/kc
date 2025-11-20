/**
 * Mock for static asset files (images, etc.)
 * Used by Jest to handle image imports
 */
const React = require('react');

// 创建一个 mock SVG 组件
const MockSvgComponent = (props) => React.createElement('svg', props);

module.exports = {
  __esModule: true,
  default: 'test-file-stub',
  ReactComponent: MockSvgComponent,
};

