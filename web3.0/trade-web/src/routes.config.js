/**
 * Owner: garuda@kupotech.com
 * 路由文件，base-web 匹配 /trade 开头的pathname, 进入工程之后，所有的路由都导向 index.js
 */

import loadable from '@loadable/component';

export default [
  {
    path: '/',
    component: loadable(() => import(/* webpackChunkName: 'layout__index' */ 'pages/index.js')),
    routes: [
      {
        path: '/404',
        exact: true,
        component: loadable(() => import(/* webpackChunkName: '404' */ 'pages/404')),
      },
      {
        path: '*',
        component: loadable(() => import(/* webpackChunkName: 'layout__index' */ 'pages/index.js')),
      },
    ],
  },
];
