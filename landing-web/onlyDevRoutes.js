// https://v3.umijs.org/zh-CN/config#:~:text=ssr%20%E9%85%8D%E7%BD%AE%EF%BC%8C%E5%9C%A8-,umi%20build,-%E5%90%8E%EF%BC%8C%E4%BC%9A%E8%B7%AF
// 开发环境默认运行会跑所有的路由，启动太慢；所以通过这个配置只运行开发想关注的路由页面；启动方式: start:fast
const routes = [
  {
    path: '/',
    component: '../layouts/index.js',
    routes: [
      // {
      //   path: '/earn-crypto-rewards-by-referring',
      //   component: './earn-crypto-rewards-by-referring/index.jsx',
      // },
      // { path: '/crypto-cup', component: './crypto-cup/index.js' },
      // { path: '/error', component: './error/index.js' },
      // { path: '/kucoinlabs', component: './kucoinlabs/index.js' },
      // { path: '/nft-info', component: './nft-info/index.js' },
      // { path: '/price-protect', component: './price-protect/index.js' },
      // { path: '/register', component: './register/index.js' },
      // { path: '/brand-broker', component: './brand-broker/index.js' },
      // {
      //   path: '/promotions',
      //   component: './promotions/_layout.js',
      //   routes: [{ path: '/promotions/:id', component: './promotions/$path.js' }],
      // },
      // {
      //   path: '/KuRewards',
      //   component: './KuRewards/_layout.js',
      //   routes: [{ path: '/KuRewards', component: './KuRewards/index.js' }],
      // },
      // {
      //   path: '/refer-friends-to-kucoin-and-win-free-travel',
      //   component: './refer-friends-to-kucoin-and-win-free-travel/index.js',
      // },
    ],
  },
];

module.exports = {
  routes,
};
