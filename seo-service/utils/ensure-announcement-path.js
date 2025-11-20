/**
 * Owner: hanx.wei@kupotech.com
 */
// 正常的 path 应该是形如 /zh-cn-en-eul-gets-listed-on-kucoin 这样的值
// 存在脏数据会返回带完整链接的 /https://www.kucoin.net/news/announcement-pursuant-to-article-15-of-terms-of-us
// 这里过滤处理一次，确保 /xxx 这样的 path
const path = require('path');

module.exports = (routePath = '') => {
  const { root, name } = path.parse(routePath);
  return root + name;
};
