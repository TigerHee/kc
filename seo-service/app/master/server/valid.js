const validParams = (langs, routes, withLangRoutesMap, routeSets) => {
  if (langs && !Array.isArray(langs)) {
    return {
      status: false,
      msg: '语言参数请传入一个数组',
    };
  }
  if (routes && !Array.isArray(routes)) {
    return {
      status: false,
      msg: 'routes参数请传入一个数组',
    };
  }
  if (routeSets && !Array.isArray(routeSets)) {
    return {
      status: false,
      msg: 'routeSets参数请传入一个数组',
    };
  }
  if (JSON.stringify(withLangRoutesMap) === '{}') {
    return {
      status: false,
      msg: 'withLangRoutesMap参数不能为空',
    };
  }
  if (!routes && !withLangRoutesMap && !routeSets) {
    return {
      status: false,
      msg: '请保证路由相关参数routes, withLangRoutesMap, routeSets至少传入一个',
    };
  }
  return {
    status: true,
  };
};
module.exports = validParams;
