/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';
import { useParams, useRouteMatch, useLocation, withRouter } from 'react-router-dom';

export default () => (Component) =>
  withRouter((props) => {
    const { route } = props;
    const params = useParams();
    const { pathname, query } = useLocation();
    const { path: currentRoute } = useRouteMatch();

    const combinedQuery = React.useMemo(() => {
      let initQuery = { ...query, ...params };
      // 如果route存在，则表明是_layout匹配，遍历route.routes，取到当前匹配的参数
      if (_.isObject(route)) {
        _.every(route.routes || [], (r) => {
          if (r.path === pathname) {
            return false;
          }

          const reg = pathToRegexp(r.path);

          const result = reg.exec(pathname);

          if (result) {
            const [, { name: key }] = pathToRegexp.parse(r.path);

            initQuery = { ...query, [key]: result[1] };

            return false;
          }

          return true;
        });
      }

      return initQuery;
    }, [params, pathname, query, route]);

    // 为兼容next-web，把query和params统一放在query当中
    const routerProps = React.useMemo(() => {
      return { currentRoute, pathname, query: combinedQuery };
    }, [combinedQuery, currentRoute, pathname]);

    return <Component {...routerProps} {...props} />;
  });
