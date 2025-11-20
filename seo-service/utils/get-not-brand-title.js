/**
 * og:title 需要去除品牌
 * Owner: hanx.wei@kupotech.com
 */
const getNotBrandTitle = (title = '') => title.replace(/[|｜]*\s*kucoin/i, '');
module.exports = getNotBrandTitle;
