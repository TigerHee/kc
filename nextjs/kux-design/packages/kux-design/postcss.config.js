/* eslint-disable */
module.exports = {
  plugins: [
    require('postcss-logical-polyfill')({
      // RTL 先输出, 保证在 RTL 内嵌 LTR 时，LTR 的样式优先级更高
      outputOrder: 'rtl-first',
    }),
  ],
};
