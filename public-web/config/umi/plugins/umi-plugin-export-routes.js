function flatRoutes(routes) {
  const flattedRoutes = [];
  function flat(_routes) {
    if (_routes) {
      for (let index = 0; index < _routes.length; index++) {
        const route = _routes[index];
        if (route.exact) {
          delete route.exact;
          flattedRoutes.push(route);
        } else {
          flat(route.routes);
        }
      }
    }
  }
  flat(routes);

  return flattedRoutes;
}

export default (api) => {
  api.logger.info('Export pages');
  api.modifyRoutes((routes) => {
    console.log(JSON.stringify(flatRoutes(routes.concat())));
  });
};
