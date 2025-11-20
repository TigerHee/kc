/*
用于 kucoin.io 域名的百度统计代码，只在 kucoin.io 域名下生效
*/
const isKucoinTop = window.location.hostname.indexOf('kucoin.io') >= 0;
if (isKucoinTop) {
  const _hmt = [];
  const hm = document.createElement('script');
  hm.src = 'https://hm.baidu.com/hm.js?3bcea4902cbcb6bd0fbccdca4b958b1c';
  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(hm, s);
}
