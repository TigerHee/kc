/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { Route } from 'dva/router';
import dynamic from 'dva/dynamic';
import _ from 'lodash';

const dynamicCatche = {};

export default (pages, app, match) => {
  return _.map(pages, (page, pathname) => {
    if (!_.isPlainObject(page)) {
      return null;
    }
    // 缓存dynamic组件
    let component;
    const path = match ? `${match.path}${pathname}` : pathname;
    if (dynamicCatche[path] != null) {
      component = dynamicCatche[path];
    } else {
      component = dynamic({ app, ...page });
      dynamicCatche[path] = component;
    }
    return (
      <Route
        exact={page.exact === undefined || page.exact}
        key={pathname}
        path={path}
        component={component}
      />
    );
  });
};
