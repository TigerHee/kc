/**
 * Owner: chelsey.fan@kupotech.com
 */
import loadable from '@loadable/component';
import { INDEPENDENT_ARTICLE_PATHS, AU_INDEPENDENT_ARTICLE_PATHS, SITE_CONFIG } from 'config/base';
import { tenantConfig } from 'src/config/tenant';

const siteRoute = tenantConfig.siteRoute;

const INDEPENDENT_ARTICLE_ROUTES = INDEPENDENT_ARTICLE_PATHS.map((path) => {
  return {
    path,
    exact: true,
    activeSiteConfig: () => ['KC_ROUTE', 'AU_ROUTE', 'EU_ROUTE'].includes(siteRoute),
    component: loadable(() =>
      import(
        /* webpackChunkName: 'p__announcement__independentPath$' */ './pages/legal/[independentPath$].js'
      ),
    ),
  };
});

const AU_INDEPENDENT_ARTICLE_ROUTES = AU_INDEPENDENT_ARTICLE_PATHS.map((path) => {
  return {
    path,
    exact: true,
    activeSiteConfig: () => ['AU_ROUTE'].includes(siteRoute),
    component: loadable(() =>
      import(
        /* webpackChunkName: 'p__announcement__independentPath$' */ './pages/legal/[independentPath$].js'
      ),
    ),
  };
});

const routes = [
  {
    path: '/',
    component: loadable(() =>
      import(/* webpackChunkName: 'layouts__index' */ './layouts/index.js'),
    ),
    routes: [
      {
        path: '/cert',
        exact: true,
        component: loadable(() =>
          import(/* webpackChunkName: 'p__cert__index' */ './pages/cert/index.js'),
        ),
      },
      {
        path: '/cert/qrcode/:id',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'AU_ROUTE', 'EU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__cert_qrcode__index' */ './pages/cert/qrcode.js'),
        ),
      },
      {
        path: '/convert',
        exact: true,
        activeSiteConfig: () => window._SITE_CONFIG_.functions.convert,
        component: loadable(() =>
          import(/* webpackChunkName: 'p__convert__index' */ './pages/convert/index.js'),
        ),
      },
      {
        path: '/kcs',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'AU_ROUTE', 'EU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__kcs__index' */ './pages/kcs/index.js'),
        ),
      },
      {
        path: '/download',
        routes: [
          {
            path: '/download/android',
            exact: true,
            activeSiteConfig: () => ['KC_ROUTE', 'AU_ROUTE', 'EU_ROUTE'].includes(tenantConfig.siteRoute),
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__download__android__index' */ './pages/download/android/index.js'
              ),
            ),
          },
          {
            path: '/download/android-latest',
            exact: true,
            activeSiteConfig: () => ['KC_ROUTE', 'AU_ROUTE', 'EU_ROUTE'].includes(tenantConfig.siteRoute),
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__download__android-latest__index' */ './pages/download/android-latest/index.js'
              ),
            ),
          },
          {
            path: '/download',
            exact: true,
            activeSiteConfig: () => ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE', 'AU_ROUTE', 'EU_ROUTE'].includes(tenantConfig.siteRoute),
            component: loadable(() =>
              import(/* webpackChunkName: 'p__download__index' */ './pages/download/index.js'),
            ),
          },
          {
            path: '/download/ios',
            exact: true,
            activeSiteConfig: () => ['KC_ROUTE', 'AU_ROUTE', 'EU_ROUTE'].includes(tenantConfig.siteRoute),
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__download__ios__index' */ './pages/download/ios/index.js'
              ),
            ),
          },
        ],
        component: loadable(() =>
          import(/* webpackChunkName: 'p__download___layout' */ './pages/download/_layout.js'),
        ),
      },
      {
        path: '/information',
        routes: [
          {
            path: '/information/currencyOffline',
            exact: true,
            activeSiteConfig: () => ['KC_ROUTE'].includes(siteRoute),
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__information__currencyOffline__index' */ './pages/information/currencyOffline/index.js'
              ),
            ),
          },
        ],
      },
      {
        path: '/aptp',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE'].includes(siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__aptp__index' */ './pages/aptp/index.js'),
        ),
      },
      {
        path: '/aptp/myOrder',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE'].includes(siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__aptp__myOrder__index' */ './pages/aptp/myOrder/index.js'),
        ),
      },
      {
        path: '/pre-market/myOrder',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE'].includes(siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__pre-market__myOrder__index' */ './pages/pre-market/myOrder/index.js'
          ),
        ),
      },
      {
        path: '/pre-market',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE'].includes(siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__pre-market__index' */ './pages/pre-market/index.js'),
        ),
      },
      {
        path: '/pre-market/:coin',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE'].includes(siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__pre-market__new-coin' */ './pages/pre-market/[new-coin$].js'
          ),
        ),
      },
      {
        path: '/gemspace/:type?',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__rocket-zone__index' */ './pages/rocket-zone/index.js'),
        ),
      },
      {
        path: '/gemvote',
        activeSiteConfig: () => SITE_CONFIG?.functions?.spot_growth,
        exact: true,
        component: loadable(() =>
          import(/* webpackChunkName: 'p__votehub__index' */ './pages/votehub/index.js'),
        ),
      },
      {
        path: '/gemvote/record',
        activeSiteConfig: () => SITE_CONFIG?.functions?.spot_growth,
        exact: true,
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__votehub__record_list__index' */ './pages/votehub/recordList/index.js'
          ),
        ),
      },
      {
        path: '/gemvote/history',
        activeSiteConfig: () => SITE_CONFIG?.functions?.spot_growth,
        exact: true,
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__votehub__history_list__index' */ './pages/votehub/history-list/index.js'
          ),
        ),
      },
      {
        path: '/gemvote/voting',
        activeSiteConfig: () => SITE_CONFIG?.functions?.spot_growth,
        exact: true,
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__votehub__project_list__index' */ './pages/votehub/active-list/index.js'
          ),
        ),
      },
      {
        path: '/gempool',
        activeSiteConfig: () => SITE_CONFIG?.functions?.spot_growth,
        exact: true,
        component: loadable(() =>
          import(/* webpackChunkName: 'p__gempool__index' */ './pages/gempool/index.js'),
        ),
      },
      {
        path: '/gempool/history',
        activeSiteConfig: () => SITE_CONFIG?.functions?.spot_growth,
        exact: true,
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__gempool__history__index' */ './pages/gempool/project-list/index.js'
          ),
        ),
      },
      {
        path: '/gempool/historical-earnings',
        activeSiteConfig: () => SITE_CONFIG?.functions?.spot_growth,
        exact: true,
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__gempool__historical-earnings__index' */ './pages/gempool/historical-earnings/index.js'
          ),
        ),
      },
      {
        path: '/gempool/:coin?',
        activeSiteConfig: () => SITE_CONFIG?.functions?.spot_growth,
        exact: true,
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__gempool__detail__index' */ './pages/gempool/detail/[coin$].js'
          ),
        ),
      },
      {
        // 司法协查
        path: '/legal/requests',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'AU_ROUTE', 'EU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'requests_legal' */ './pages/legal/legalRequests.js'),
        ),
      },
      {
        // sp系列暂不支持多租户。产品：irine.lv
        path: '/spotlight-center',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'AU_ROUTE', 'EU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__spotlight-center__index' */ './pages/spotlight/center/index.js'
          ),
        ),
      },
      {
        path: '/spotlight_r6/:id?',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'AU_ROUTE', 'EU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__spotlight_r6_index' */ './pages/spotlight/spotlightr6/index.js'
          ),
        ),
      },
      {
        path: '/spotlight7',
        routes: [
          {
            path: '/spotlight7/:id?',
            exact: true,
            activeSiteConfig: () => ['KC_ROUTE', 'AU_ROUTE', 'EU_ROUTE'].includes(tenantConfig.siteRoute),
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__spotlight_r7_index' */ './pages/spotlight/spotlightr7/index.js'
              ),
            ),
          },
          {
            path: '/spotlight7/purchase-record/:recordId?',
            exact: true,
            activeSiteConfig: () => ['KC_ROUTE', 'AU_ROUTE', 'EU_ROUTE'].includes(tenantConfig.siteRoute),
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__spotlight_r7_record_index' */ './pages/spotlight/spotlightr7/record.js'
              ),
            ),
          },
        ],
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__spotlight_r7_layout' */ './pages/spotlight/spotlightr7/_layout.js'
          ),
        ),
      },
      {
        path: '/spotlight_r8',
        routes: [
          {
            path: '/spotlight_r8/:id?',
            exact: true,
            activeSiteConfig: () => ['KC_ROUTE', 'AU_ROUTE', 'EU_ROUTE'].includes(tenantConfig.siteRoute),
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__spotlight_r8_index' */ './pages/spotlight/spotlightr8/index.js'
              ),
            ),
          },
          {
            path: '/spotlight_r8/purchase-record/:recordId?',
            exact: true,
            activeSiteConfig: () => ['KC_ROUTE', 'AU_ROUTE', 'EU_ROUTE'].includes(tenantConfig.siteRoute),
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__spotlight_r8_record_index' */ './pages/spotlight/spotlightr8/record.js'
              ),
            ),
          },
        ],
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__spotlight_r8_layout' */ './pages/spotlight/spotlightr8/_layout.js'
          ),
        ),
      },
      {
        path: '/user-guide',
        routes: [
          {
            path: '/user-guide/spot',
            exact: true,
            activeSiteConfig: () => ['KC_ROUTE'].includes(siteRoute),
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__userGuide__spot__index' */ './pages/userGuide/spot.js'
              ),
            ),
          },
          {
            path: '/user-guide/margin',
            exact: true,
            activeSiteConfig: () => ['KC_ROUTE'].includes(siteRoute),
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__userGuide__margin__index' */ './pages/userGuide/margin.js'
              ),
            ),
          },
        ],
      },
      ...INDEPENDENT_ARTICLE_ROUTES,
      ...AU_INDEPENDENT_ARTICLE_ROUTES,
    ],
  },
];

export default routes;
