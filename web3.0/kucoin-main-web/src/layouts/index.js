/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import RootEmotionCacheProvider from 'components/Root/RootEmotionCacheProvider';
import getIsInApp from 'utils/runInApp';
import Root from 'components/Root';
import { ThemeProvider } from '@kux/mui';
import _ from 'lodash';
import useRouteChange from 'hooks/useRouteChange';
import useTdk from 'hooks/tdk/useTdk';
import useHtmlLang from 'hooks/useHtmlLang';
import { isTMA } from 'utils/tma/bridge';
import ThemeChange from 'src/components/ThemeChange';

const getLayoutType = ({ pathname }) => {
  let type = Root.LayoutType.BOTH;
  // 判断是否是在App中
  const isApp = getIsInApp() || false;

  if (isApp || isTMA()) {
    return Root.LayoutType.ONLYMAIN;
  }

  const config = {
    '/best-crypto-exchanges-award-2021-kucoin': Root.LayoutType.ONLYMAIN,
    '/beginner-zone/rule': Root.LayoutType.ONLYMAIN,
    '/spot-nft': () => (isApp ? Root.LayoutType.ONLYMAIN : Root.LayoutType.BOTH),
    '/nft-token/intro': () => (isApp ? Root.LayoutType.ONLYMAIN : Root.LayoutType.BOTH),
  };
  Object.keys(config).forEach((_path) => {
    if (_.startsWith(pathname, _path)) {
      const _type = config[_path];

      if (_type) {
        if (typeof _type === 'function') {
          type = _type();
        } else {
          type = _type;
        }
      }
    }
  });
  return type;
};

/**
 * flatten routes
 *
 * @param   {[type]}  _routes  [_routes description]
 *
 * @return  {[type]}           [return description]
 */
function resolveRoutes(_routes) {
  return _routes.map((v) => {
    if (v.routes) {
      return [...resolveRoutes(v.routes)];
    }
    return v;
  });
}

export default (props) => {
  const {
    location: { pathname, query },
    routes,
  } = props;
  const type = getLayoutType({
    pathname,
    query,
  });
  const _routes = resolveRoutes(routes[0].routes);
  window.__KC_CRTS__ = _.flatten(_routes);

  useRouteChange();
  useTdk();
  useHtmlLang();

  return (
    <RootEmotionCacheProvider>
      <ThemeProvider>
        <ThemeChange>
          <Root type={type}>{props.children}</Root>
        </ThemeChange>
      </ThemeProvider>
    </RootEmotionCacheProvider>
  );
};
