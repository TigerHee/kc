// https://v3.umijs.org/zh-CN/config#:~:text=ssr%20%E9%85%8D%E7%BD%AE%EF%BC%8C%E5%9C%A8-,umi%20build,-%E5%90%8E%EF%BC%8C%E4%BC%9A%E8%B7%AF
// 开发环境默认运行会跑所有的路由，启动太慢；所以通过这个配置只运行开发想关注的路由页面；启动方式: start:fast
export const routes = [
  {
    path: '/',
    component: '@/layouts/index',
    routes: [
      {
        path: '/learn',
        exact: true,
        component: '@/pages/learn/index.js',
      },
      {
        path: '/learn/:category',
        exact: true,
        component: '@/pages/learn/[category]/index.jsx',
      },
      {
        path: '/learn/:category/page/:page',
        exact: true,
        component: '@/pages/learn/[category]/page/[page].jsx',
      },
      {
        path: '/learn/:category/:title',
        exact: true,
        component: '@/pages/learn/[category]/[title].jsx',
      },
    ],
  },
];
