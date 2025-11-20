/**
 * Owner: hanx.wei@kupotech.com
 */
module.exports = () => {
  // 公告静态路由
  const staticAnnouncementRoutes = [
    'new-listings',
    'activities',
    'product-updates',
    'maintenance-updates',
    'delistings',
    'others',
    'history',
  ].map(v => {
    return `/announcement/${v}`;
  });
  staticAnnouncementRoutes.push('/announcement');
  return staticAnnouncementRoutes;
};
