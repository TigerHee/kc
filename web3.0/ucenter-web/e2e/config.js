module.exports = {
  cypress: {
    // screenshotOnRunFailure: true,
    e2e: {
      // baseUrl: 'http://localhost:8000',
      baseUrl: 'https://www.kucoin.tr',
      // baseUrl: 'https://www.kucoin.com',
      // baseUrl: 'https://nginx-web-01.sit.kucoin.net'
    },
  },
  teamsId: '19:b3edcc4ee55042a293dab2438266d64e@thread.v2',
  alarm_group: '用户前端值班组', // kunlun 告警值班组
  router: {
    //  路由卡点配置
    variableName: 'default', //  读取文件导出的变量名，default 为默认导出
    path: 'src/router.config.js', //  读取的路由文件
    globalVariables: {
      // 解析的文件挂载的全局对象，
      // 已经内置 umi 使用的 __IS_BROWSER， 和 window 对象
      // 如果路由文件依赖
    },
    alias: {
      // 如果router文件存在引用别名路径才需要配置
      // 例如 public-web 里面的 import alias from '../config/webpack/alias';
    },
    exclude: []
  },
};
