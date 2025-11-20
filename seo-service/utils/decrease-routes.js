/**
 * Owner: hanx.wei@kupotech.com
 */
const decreaseRoutes = (allRoutes, options = {}) => {
  if (!Array.isArray(allRoutes)) {
    return allRoutes;
  }
  const { count = 60, reservedRoutes = [] } = options;
  let routes = allRoutes.slice(0, count);
  if (reservedRoutes.length !== 0) {
    routes.push(...reservedRoutes);
    routes = Array.from(new Set(routes));
  }
  return routes;
};

module.exports = decreaseRoutes;
