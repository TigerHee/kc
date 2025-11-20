/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import {exitRN} from '@krn/bridge';
import {FallbackPage} from '@krn/ui';

import {getSiteType} from './tenant';

const ErrorPage = () => {
  return (
    <FallbackPage
      description="Sorry, the page you were looking for was not found."
      onPressBack={() => exitRN()}
    />
  );
};

// 递归 routes，如果配置了 activeBrandKeys 字段，则判断 currentSite 是否在其中，如果不在，则删除该条路由
// 如果没有配置 activeBrandKeys 字段，则不做处理，默认全部站点都展示
export const filterRoutes = routes => {
  const currentSite = getSiteType();
  return routes.map(route => {
    if (
      Array.isArray(route.activeBrandKeys) &&
      !route.activeBrandKeys.includes(currentSite)
    ) {
      route.component = ErrorPage;
    }
    if (route.routes) {
      route.routes = filterRoutes(route.routes);
    }
    return route;
  });
};
