const fs = require('fs');
const path = require('path');

const now = [
  {
    path: '/',
    routes: [
      {
        path: '/404',
        exact: true,
      },
      {
        path: '/about-us',
        exact: true,
      },
      {
        path: '/activity/anniversary',
        exact: true,
      },
      {
        path: '/activity/:id',
        exact: true,
      },
      {
        path: '/activity-center',
        exact: true,
      },
      {
        path: '/affiliate',
        exact: true,
      },
      {
        path: '/affiliate-apply',
        exact: true,
      },
      {
        path: '/affiliate-system',
        exact: false,
        routes: [
          {
            path: '/affiliate-system',
            exact: true,
          },
          {
            path: '/affiliate-system/overview',
            exact: true,
          },
          {
            path: '/affiliate-system/first-level-invitee',
            exact: true,
          },
          {
            path: '/affiliate-system/invite-code',
            exact: true,
          },
          {
            path: '/affiliate-system/sub-affiliate',
            exact: true,
          },
        ],
      },
      {
        path: '/assets-detail',
        exact: true,
      },
      {
        path: '/assets-pol',
        exact: true,
      },
      {
        path: '/beginner-zone',
        exact: true,
      },
      {
        path: '/beginner-zone/rule',
        exact: true,
      },
      {
        path: '/best-crypto-exchanges-award-2021-kucoin',
        exact: true,
      },
      {
        path: '/careers',
        exact: true,
      },
      {
        path: '/careers/job-opening/:id?/:page?',
        exact: true,
      },
      {
        path: '/component-preview',
        exact: true,
      },
      {
        path: '/content-creator-program',
        exact: true,
      },
      {
        path: '/earn-account/order',
        exact: true,
      },
      {
        path: '/fast-coin/order/:id',
        exact: true,
      },
      {
        path: '/fast-coin/order-details/:id',
        exact: true,
      },
      {
        path: '/freezing',
        exact: true,
      },
      {
        path: '/index-detail/:currency',
        exact: true,
      },
      {
        path: '/kucoin-ventures',
        exact: true,
      },
      {
        path: '/kyc-advance-result',
        exact: true,
      },
      {
        path: '/lightning-exchange',
        exact: true,
      },
      {
        path: '/lightning-list',
        exact: true,
      },
      {
        path: '/listing/apply',
        exact: true,
      },
      {
        path: '/listing',
        exact: true,
      },
      {
        path: '/new-cryptocurrencies',
        exact: true,
      },
      {
        path: '/nft-token/intro',
        exact: true,
      },
      {
        path: '/oauth',
        exact: true,
      },
      {
        path: '/proof-of-reserves/detail/:id',
        exact: true,
      },
      {
        path: '/proof-of-reserves/faq',
        exact: true,
      },
      {
        path: '/proof-of-reserves',
        exact: true,
      },
      {
        path: '/r/af/:code',
        exact: true,
      },
      {
        path: '/r/rf/:code',
        exact: true,
      },
      {
        path: '/r/:code',
        exact: true,
      },
      {
        path: '/records-v1',
        exact: true,
      },
      {
        path: '/referral/detail',
        exact: true,
      },
      {
        path: '/referral',
        exact: true,
      },
      {
        path: '/referral-old',
        exact: true,
      },
      {
        path: '/security',
        exact: true,
      },
      {
        path: '/spot-nft/collection',
        exact: true,
      },
      {
        path: '/spot-nft/distribute/:id',
        exact: true,
      },
      {
        path: '/spot-nft/igo',
        exact: true,
      },
      {
        path: '/spot-nft/main',
        exact: true,
      },
      {
        path: '/spot-nft/pikaster',
        exact: true,
      },
      {
        path: '/spot-nft/project/:id',
        exact: true,
      },
      {
        path: '/spot-nft/project/:id/:index/token',
        exact: true,
      },
      {
        path: '/spot-nft/project/:id/:index/:type',
        exact: true,
      },
      {
        path: '/spot-nft/token-sell/:currency/:index',
        exact: true,
      },
      {
        path: '/spotlight/:id',
        exact: true,
      },
      // {
      //   path: '/spotlight-center',
      //   exact: true,
      // },
      {
        path: '/staking',
        exact: true,
      },
      {
        path: '/test',
        exact: true,
      },
      {
        path: '/account',
        routes: [
          {
            path: '/account/api/activation',
            exact: true,
          },
          {
            path: '/account/api/create',
            exact: true,
          },
          {
            path: '/account/api/create/security',
            exact: true,
          },
          {
            path: '/account/api/edit',
            exact: true,
          },
          {
            path: '/account/api/edit/postsecurity',
            exact: true,
          },
          {
            path: '/account/api/edit/presecurity',
            exact: true,
          },
          {
            path: '/account/api',
            exact: true,
          },
          {
            path: '/account/download',
            exact: true,
          },
          {
            path: '/account',
            exact: true,
          },
          {
            path: '/account/kyc/app-kyc',
            exact: true,
          },
          {
            path: '/account/kyc',
            exact: true,
          },
          {
            path: '/account/kyc/introduce',
            exact: true,
          },
          {
            path: '/account/kyc/mechanism-kyc',
            exact: true,
          },
          {
            path: '/account/kyc/personal-kyc1',
            exact: true,
          },
          {
            path: '/account/kyc/personal-kyc1-info',
            exact: true,
          },
          {
            path: '/account/kyc/personal-kyc2',
            exact: true,
          },
          {
            path: '/account/kyc/personal-kyc2-jumio',
            exact: true,
          },
          {
            path: '/account/kyc/result',
            exact: true,
          },
          {
            path: '/account/profile',
            exact: true,
          },
          {
            path: '/account/security/api',
            exact: true,
          },
          {
            path: '/account/security/email',
            exact: true,
          },
          {
            path: '/account/security/g2fa',
            exact: true,
          },
          {
            path: '/account/security',
            exact: true,
          },
          {
            path: '/account/security/phone',
            exact: true,
          },
          {
            path: '/account/security/protect',
            exact: true,
          },
          {
            path: '/account/security/unbind-email',
            exact: true,
          },
          {
            path: '/account/security/unbind-phone',
            exact: true,
          },
          {
            path: '/account/security/updatepwd',
            exact: true,
          },
          {
            path: '/account/security/deleteAccount',
            routes: [
              {
                path: '/account/security/deleteAccount',
                exact: true,
              },
            ],
          },
          {
            path: '/account/security/forgetWP',
            routes: [
              {
                path: '/account/security/forgetWP',
                exact: true,
              },
            ],
          },
          {
            path: '/account/security/:wordType',
            exact: true,
          },
          {
            path: '/account/sub/history/:type?',
            exact: true,
          },
          {
            path: '/account/sub',
            exact: true,
          },
        ],
      },
      {
        path: '/account-sub',
        routes: [
          {
            path: '/account-sub/api-manager/create/security/:sub',
            exact: true,
          },
          {
            path: '/account-sub/api-manager/create/:sub',
            exact: true,
          },
          {
            path: '/account-sub/api-manager/edit/postsecurity/:sub',
            exact: true,
          },
          {
            path: '/account-sub/api-manager/edit/presecurity/:sub',
            exact: true,
          },
          {
            path: '/account-sub/api-manager/edit/:sub',
            exact: true,
          },
          {
            path: '/account-sub/api-manager/:sub',
            exact: true,
          },
          {
            path: '/account-sub/assets/:sub',
            exact: true,
          },
        ],
      },
      {
        path: '/assets',
        routes: [
          {
            path: '/assets/bonus/encourage',
            exact: true,
          },
          {
            path: '/assets/bonus/encouragement',
            exact: true,
          },
          {
            path: '/assets/bonus',
            exact: true,
          },
          {
            path: '/assets/bonus/loans',
            exact: true,
          },
          {
            path: '/assets/bonus/margin-bonus',
            exact: true,
          },
          {
            path: '/assets/bonus/referral',
            exact: true,
          },
          {
            path: '/assets/bonus/rewards',
            exact: true,
          },
          {
            path: '/assets/bot-account',
            exact: true,
          },
          {
            path: '/assets/coin/:coin?',
            exact: true,
          },
          {
            path: '/assets/earn-account/coupons',
            exact: true,
          },
          {
            path: '/assets/earn-account',
            exact: true,
          },
          {
            path: '/assets/faq',
            exact: true,
          },
          {
            path: '/assets/fiat-currency/advcash-result',
            exact: true,
          },
          {
            path: '/assets/fiat-currency/plaid-result',
            exact: true,
          },
          {
            path: '/assets/fiat-currency/recharge/confirm/:channelId',
            exact: true,
          },
          {
            path: '/assets/fiat-currency/recharge/detail/:orderId?',
            exact: true,
          },
          {
            path: '/assets/fiat-currency/recharge',
            exact: true,
          },
          {
            path: '/assets/fiat-currency/recharge/:orderId?',
            exact: true,
          },
          {
            path: '/assets/fiat-currency/withdraw',
            exact: true,
          },
          {
            path: '/assets/fiat-currency/withdraw/:orderId?',
            exact: true,
          },
          {
            path: '/assets/futures-account/assets-history',
            exact: true,
          },
          {
            path: '/assets/futures-account/coupon-records/detail/:couponId',
            exact: true,
          },
          {
            path: '/assets/futures-account/coupon-records',
            exact: true,
          },
          {
            path: '/assets/futures-account/funds-history',
            exact: true,
          },
          {
            path: '/assets/futures-account',
            exact: true,
          },
          {
            path: '/assets/futures-account/order-history',
            exact: true,
          },
          {
            path: '/assets/futures-account/profit-history',
            exact: true,
          },
          {
            path: '/assets/futures-account/trade-history',
            exact: true,
          },
          {
            path: '/assets/futures-account/transfer-records',
            exact: true,
          },
          {
            path: '/assets/high-frequency-account',
            exact: true,
          },
          {
            path: '/assets',
            exact: true,
          },
          {
            path: '/assets/main-account',
            exact: true,
          },
          {
            path: '/assets/margin-account',
            exact: true,
          },
          {
            path: '/assets/margin-account/isolated',
            exact: true,
          },
          {
            path: '/assets/margin-account/margin',
            exact: true,
          },
          {
            path: '/assets/order',
            exact: true,
          },
          {
            path: '/assets/payments',
            exact: true,
          },
          {
            path: '/assets/payments/:channelId',
            exact: true,
          },
          {
            path: '/assets/record',
            exact: true,
          },
          {
            path: '/assets/trade-account/convertKCS',
            exact: true,
          },
          {
            path: '/assets/trade-account/convertKCS/record',
            exact: true,
          },
          {
            path: '/assets/trade-account',
            exact: true,
          },
          {
            path: '/assets/withdraw',
            exact: true,
          },
          {
            path: '/assets/withdraw/:coin',
            exact: true,
          },
        ],
      },
      {
        path: '/blog',
        routes: [
          {
            path: '/blog/categories/:category/:path?',
            exact: true,
          },
          {
            path: '/blog',
            exact: true,
          },
          {
            path: '/blog/:path',
            exact: true,
          },
        ],
      },
      {
        path: '/converter',
        routes: [
          {
            path: '/converter',
            exact: true,
          },
          {
            path: '/converter/:coin',
            exact: true,
          },
        ],
      },
      {
        path: '/forms',
        routes: [
          {
            path: '/forms/verify',
            exact: true,
          },
        ],
      },
      {
        path: '/freeze',
        routes: [
          {
            path: '/freeze/apply',
            exact: true,
          },
          {
            path: '/freeze',
            exact: true,
          },
        ],
      },
      {
        path: '/how-to-buy',
        routes: [
          {
            path: '/how-to-buy',
            exact: true,
          },
          {
            path: '/how-to-buy/:coin',
            exact: true,
          },
        ],
      },
      {
        path: '/join-us',
        routes: [],
      },
      {
        path: '/leveraged-tokens',
        routes: [
          {
            path: '/leveraged-tokens/detail/:token',
            exact: true,
          },
          {
            path: '/leveraged-tokens',
            exact: true,
          },
        ],
      },
      {
        path: '/margin',
        routes: [
          {
            path: '/margin/borrow',
            exact: true,
          },
          {
            path: '/margin/borrow/:market',
            exact: true,
          },
          {
            path: '/margin/borrow/:market/:symbol',
            exact: true,
          },
          {
            path: '/margin/lend',
            exact: true,
          },
          {
            path: '/margin/lend/:market',
            exact: true,
          },
          {
            path: '/margin/user/loan',
            exact: true,
          },
          {
            path: '/margin/user/loan/:currency',
            exact: true,
          },
          {
            path: '/margin/v2/lend',
            exact: true,
          },
          {
            path: '/margin/v2/lend/order/:type?',
            exact: true,
          },
        ],
      },
      {
        path: '/order',
        routes: [
          {
            path: '/order',
            exact: true,
          },
          {
            path: '/order/isolated/:type?',
            exact: true,
          },
          {
            path: '/order/margin/:type?',
            exact: true,
          },
          {
            path: '/order/trade/:type?',
            exact: true,
          },
        ],
      },
      {
        path: '/otc',
        routes: [
          {
            path: '/otc/Tab',
            exact: true,
          },
          {
            path: '/otc',
            exact: true,
          },
          {
            path: '/otc/user/ads',
            exact: true,
          },
          {
            path: '/otc/user/ads/publish',
            exact: true,
          },
          {
            path: '/otc/user/ads/update/:adNo',
            exact: true,
          },
          {
            path: '/otc/user/orders',
            exact: true,
          },
          {
            path: '/otc/user/orders/:orderNo',
            exact: true,
          },
          {
            path: '/otc/user/payments',
            exact: true,
          },
          {
            path: '/otc/:listType',
            exact: true,
          },
          {
            path: '/otc/:listType/:coinLegal',
            exact: true,
          },
        ],
      },
      {
        path: '/selfservice',
        routes: [
          {
            path: '/selfservice/assetsBack',
            exact: true,
          },
          {
            path: '/selfservice/assetsBack/:form',
            exact: true,
          },
          {
            path: '/selfservice/billExport',
            exact: true,
          },
          {
            path: '/selfservice/login',
            exact: true,
          },
          {
            path: '/selfservice/resetEmail',
            exact: true,
          },
          {
            path: '/selfservice/resetLoginPW',
            exact: true,
          },
          {
            path: '/selfservice/resetPhone',
            exact: true,
          },
          {
            path: '/selfservice/resetTradePW',
            exact: true,
          },
          {
            path: '/selfservice/resetg2fa',
            exact: true,
          },
        ],
      },
      {
        path: '/withdraw-addr-manage',
        routes: [
          {
            path: '/withdraw-addr-manage',
            exact: true,
          },
        ],
      },
    ],
  },
];

const _routes = [];

const traverseRoutes = (routes) => {
  routes.forEach((o) => {
    _routes.push(o.path);
    if (o.routes) {
      traverseRoutes(o.routes);
    }
  });
};

traverseRoutes(now[0].routes);

function traverseDirectory(dirPath, callback) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }
    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);
      fs.stat(fullPath, (err, stats) => {
        if (err) {
          console.error('Error reading file stats:', err);
          return;
        }
        if (stats.isDirectory()) {
          traverseDirectory(fullPath, callback);
        } else if (stats.isFile()) {
          if (/\.(js|jsx|ts|tsx)$/.test(fullPath)) {
            callback(
              fullPath
                .replace('/Users/ironliang/works/KuCoin/kucoin-main-web/src/pages', '')
                .replace(/\[/g, ':')
                .replace(/\$/g, '?')
                .replace(/\]/g, '')
                .replace(/\.(js|jsx|ts|tsx)$/, '')
                .replace(/\/index$/, '')
                .replace(/\/_layout$/, ''),
            );
          }
        }
      });
    });
  });
}

traverseDirectory(path.join(__dirname, '../src/pages'), (filePath) => {
  if (_routes.indexOf(filePath) === -1) {
    console.log(filePath);
  }
});
