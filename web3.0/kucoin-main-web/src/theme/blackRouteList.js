/**
 * Owner: solar@kupotech.com
 */

import { matchPath } from 'react-router-dom';

const darkThemePathList = [
  '/about-us',
]

// 固定黑色主题的路由
export function isFixedDarkTheme(pathname) {
  return darkThemePathList.includes(pathname);
}

export function isThemeDisabledRoute() {
  const routes = [
    '/nft-token/intro',
    '/spot-nft/collection',
    '/spot-nft/distribute/:id',
    '/spot-nft/igo',
    '/spot-nft/main',
    '/spot-nft/pikaster',
    '/spot-nft/project/:id',
    '/spot-nft/project/:id/:index/token',
    '/spot-nft/project/:id/:index/:type',
    '/spot-nft/token-sell/:currency/:index',
    '/careers/job-opening/:id?/:page',
    '/careers',
    '/about-us',
    '/withdraw-addr-manage',
    '/proof-of-reserves',
    '/content-creator-program',
    '/listing',
    '/records-v1',
    '/mining-pool',
    '/copy-trading',
    '/web3-wallet',
    '/ethereum-upgrade',
    '/careers/job-opening',
    '/bitcoin-halving',
  ];

  const localizedRoutes = routes.map((route) => `/:locale([a-zA-Z-]+)?${route}`);
  return localizedRoutes.some((path) => matchPath(location.pathname, { path, exact: true }));
}
