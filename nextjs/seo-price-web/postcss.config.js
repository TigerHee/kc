/**
 * Owner: will.wang@kupotech.com
 */

// postcss-rtlcss 配置项
const options = {
    ltrPrefix: '[dir=ltr]',
    rtlPrefix: '[dir=rtl]',
    // 防止已经有[dir=*]情况下多次转换
    safeBothPrefix: false,
    ignorePrefixedRules: true,
    processUrls: false,
    processKeyFrames: false,
    useCalc: false,
};

module.exports = {
  plugins: [
    [
      "postcss-rtlcss",
      {
        ...options,
      }
    ]
  ],
};