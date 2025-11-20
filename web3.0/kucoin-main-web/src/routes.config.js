/**
 * Owner: hanx.wei@kupotech.com
 */
import loadable from '@loadable/component';
import { tenantConfig } from 'config/tenant';

export default [
  {
    path: '/',
    component: loadable(() =>
      import(/* webpackChunkName: 'layouts__index' */ '@/layouts/index.js'),
    ),
    routes: [
      {
        path: '/404',
        exact: true,
        component: loadable(() => import(/* webpackChunkName: 'p__404' */ '@/pages/404.js')),
      },
      {
        path: '/about-us',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__about-us__index' */ '@/pages/about-us/index.js'),
        ),
      },
      {
        path: '/activity/anniversary',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__activity__anniversary__index' */ '@/pages/activity/anniversary/index.js'
          ),
        ),
      },
      {
        path: '/activity/:id',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__activity__id__index' */ '@/pages/activity/[id]/index.js'),
        ),
      },
      {
        path: '/activity-center',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__activity-center__index' */ '@/pages/activity-center/index.js'
          )
        ),
      },
      {
        path: '/beginner-zone',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__beginner-zone__index' */ '@/pages/beginner-zone/index.js'
          ),
        ),
      },
      {
        path: '/beginner-zone/rule',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__beginner-zone__rule__index' */ '@/pages/beginner-zone/rule/index.js'
          ),
        ),
      },
      {
        path: '/best-crypto-exchanges-award-2021-kucoin',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__best-crypto-exchanges-award-2021-kucoin__index' */ '@/pages/best-crypto-exchanges-award-2021-kucoin/index.js'
          ),
        ),
      },
      {
        path: '/careers',
        exact: true,
        activeSiteConfig: () => tenantConfig.careers?.show,
        component: loadable(() =>
          import(/* webpackChunkName: 'p__careers__index' */ '@/pages/careers/index.js'),
        ),
      },
      {
        path: '/content-creator-program',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__content-creator-program__index' */ '@/pages/content-creator-program/index.js'
          ),
        ),
      },
      {
        path: '/kucoin-ventures',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__kucoin-ventures__index' */ '@/pages/kucoin-ventures/index.js'
          ),
        ),
      },
      {
        path: '/listing/apply',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__listing__apply__index' */ '@/pages/listing/apply/index.js'
          ),
        ),
      },
      {
        path: '/listing',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__listing__index' */ '@/pages/listing/index.js'),
        ),
      },
      {
        path: '/new-cryptocurrencies',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__new-cryptocurrencies__index' */ '@/pages/new-cryptocurrencies/index.js'
          ),
        ),
      },
      {
        path: '/proof-of-reserves/detail/:id',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__proof-of-reserves__detail__id' */ '@/pages/proof-of-reserves/detail/[id].js'
          ),
        ),
      },
      {
        path: '/proof-of-reserves/faq',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__proof-of-reserves__faq' */ '@/pages/proof-of-reserves/faq.js'
          ),
        ),
      },
      {
        path: '/proof-of-reserves',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__proof-of-reserves__index' */ '@/pages/proof-of-reserves/index.js'
          ),
        ),
      },
      {
        path: '/r/af/:code',
        exact: true,
        activeSiteConfig: () =>
          ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__r__af__code' */ '@/pages/r/af/[code].js'),
        ),
      },
      {
        path: '/r/rf/:code',
        exact: true,
        activeSiteConfig: () =>
          ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__r__rf__code' */ '@/pages/r/rf/[code].js'),
        ),
      },
      {
        path: '/r/:code',
        exact: true,
        activeSiteConfig: () =>
          ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__r__code' */ '@/pages/r/[code].js'),
        ),
      },
      {
        path: '/records-v1',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__records-v1__index' */ '@/pages/records-v1/index.js'),
        ),
      },
      {
        path: '/security',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__securityV2__index' */ '@/pages/securityV2/index.js'),
        ),
      },
      {
        path: '/security/:id',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__securityV2__detail__index' */ '@/pages/securityDetail/index.js'
          ),
        ),
      },
      {
        path: '/nft-token/intro',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__spot-nft__redirect' */ '@/pages/nft-redirect/index.js'),
        ),
      },
      {
        path: '/spot-nft/distribute/:id',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__spot-nft__redirect' */ '@/pages/nft-redirect/index.js'),
        ),
      },
      {
        path: '/spot-nft/igo',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__spot-nft__redirect' */ '@/pages/nft-redirect/index.js'),
        ),
      },
      {
        path: '/spot-nft/main',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__spot-nft__redirect' */ '@/pages/nft-redirect/index.js'),
        ),
      },
      {
        path: '/spot-nft/pikaster',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__spot-nft__redirect' */ '@/pages/nft-redirect/index.js'),
        ),
      },
      {
        path: '/spot-nft/project/:id',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__spot-nft__redirect' */ '@/pages/nft-redirect/index.js'),
        ),
      },
      {
        path: '/spot-nft/project/:id/:index/token',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__spot-nft__redirect' */ '@/pages/nft-redirect/index.js'),
        ),
      },
      {
        path: '/spot-nft/project/:id/:index/:type',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__spot-nft__redirect' */ '@/pages/nft-redirect/index.js'),
        ),
      },
      {
        path: '/spot-nft/token-sell/:currency/:index',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__spot-nft__redirect' */ '@/pages/nft-redirect/index.js'),
        ),
      },
      {
        path: '/spot-nft/collection',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__spot-nft__collection__index' */ '@/pages/spot-nft/collection/index.js'
          ),
        ),
      },
      {
        path: '/spotlight/:id',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__spotlight__id' */ '@/pages/spotlight/[id].js'),
        ),
      },
      {
        path: '/assets/bonus',
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__assets__bonus___layout' */ '@/pages/assets/bonus/_layout.js'
          ),
        ),
        routes: [
          {
            path: '/assets/bonus',
            exact: true,
            activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__assets__bonus__index' */ '@/pages/assets/bonus/index.js'
              ),
            ),
          },
          {
            path: '/assets/bonus/margin-bonus',
            exact: true,
            activeSiteConfig: () => ['KC_ROUTE'].includes(tenantConfig.siteRoute),
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__assets__bonus__margin-bonus__index' */ '@/pages/assets/bonus/margin-bonus/index.js'
              ),
            ),
          },
          {
            path: '/assets/bonus/rewards',
            exact: true,
            activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__assets__bonus__rewards__index' */ '@/pages/assets/bonus/rewards/index.js'
              ),
            ),
          },
          {
            path: '/assets/bonus/loans',
            exact: true,
            activeSiteConfig: () => window._SITE_CONFIG_.functions.margin,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__assets__bonus__loans__index' */ '@/pages/assets/bonus/loans/index.js'
              ),
            ),
          },
          {
            path: '/assets/bonus/loans/:detail',
            exact: true,
            activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__assets__bonus__loans__index' */ '@/pages/assets/bonus/loans/$detail.js'
              ),
            ),
          },
        ],
      },
      {
        path: '/mining-pool',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__mining-pool__index' */ '@/pages/mining-pool/index.js'),
        ),
      },
      {
        path: '/bitcoin-halving',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__bitcoin-halving__index' */ '@/pages/bitcoin-halving/index.js'
          ),
        ),
      },
      {
        path: '/copy-trading',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__copy-trading__index' */ '@/pages/copy-trading/index.js'),
        ),
      },
      {
        path: '/web3-wallet',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE', 'EU_ROUTE', 'AU_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(/* webpackChunkName: 'p__web3-wallet__index' */ '@/pages/web3-wallet/index.js'),
        ),
      },
      {
        path: '/ethereum-upgrade',
        exact: true,
        activeSiteConfig: () => ['KC_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__ethereum-upgrade__index' */ '@/pages/ethereum-upgrade/index.js'
          ),
        ),
      },
    ],
  },
];
