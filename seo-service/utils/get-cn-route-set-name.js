/**
 * Owner: hanx.wei@kupotech.com
 */
const ROUTE_SETS = {
  config: '配置路由',
  routes: '指定路由',
  default: '固定路由',
  announcement: '公告路由',
  price: '币种详情路由',
  support: '帮助中心路由',
  blog: '博客路由',
  learn: '新手学院',
  converter: '兑换converter',
};

module.exports = routeSetName => {
  return ROUTE_SETS[routeSetName] || `${routeSetName}路由`;
};
