/* eslint-disable */
// Dose not interested in this file. It is just a tiny script to adjust watermark style.
// 下掉交易旧版本时删除
try {
  if (window.localStorage.getItem('tradingview.chartproperties') != undefined) {
    var version = window.localStorage.getItem('tradingview.version');
    if (version === 'v14') {
      var a = window.localStorage.getItem('tradingview.chartproperties');
      var t = window.localStorage.getItem('tradingview.current_theme.name');
      var b = JSON.parse(a);
      var c = b.symbolWatermarkProperties;
      var m = { dark: 'rgba(126,126,126,0.04)', light: 'rgba(126,126,126,0.04)' };
      var n = { dark: 'rgba(230,230,230,0.1)', light: 'rgba(230,230,230,0.3)' };
      if (c.color == m[t]) {
        c.color = n[t];
      }
      window.localStorage.setItem('tradingview.chartproperties', JSON.stringify(b));
    }
  }
} catch (error) {
  console.error(error);
}
