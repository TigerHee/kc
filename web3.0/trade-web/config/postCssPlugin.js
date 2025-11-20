/**
 * Owner: garuda@kupotech.com
 * 定义 postcss-plugin
 */
const postcssNormalize = require('postcss-normalize');
const rtlPlugin = require('postcss-rtl');

const blacklist = [
  // 'animation',
  // 'animation-duration',
  // 'animation-fill-mode',
  // 'animation-fill-mode',
  // 'animation-play-state',
  // 'animation-name',
  // 'background',
  'background-attachment',
  'background-color',
  'background-clip',
  '-webkit-background-clip',
  'background-image',
  'background-position',
  'background-position-x',
  'background-position-y',
  'background-repeat',
  'background-size',
  'border',
  'border-bottom',
  'border-bottom-color',
  'border-bottom-style',
  'border-bottom-width',
  'border-color',
  'border-style',
  'border-width',
  'border-top',
  'border-top-color',
  'border-top-style',
  'border-top-width',
  // 'border-radius',
  'box-shadow',
  'clear',
  'cursor',
  'direction',
  'float',
  'margin',
  'margin-top',
  'margin-bottom',
  'padding',
  'padding-top',
  'padding-bottom',
  // 'transform-origin',
  // 'transform',
  '-webkit-transition',
  'transition-delay',
  'transition-duration',
  'transition-property',
  'transition-timing-function',
  // 'text-align',
  // 'text-align-last',
  'text-shadow',
];

const postCssPlugin = [postcssNormalize(), rtlPlugin({ blacklist })];

export default postCssPlugin;
