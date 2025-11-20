module.exports = {
  cypress: {
    e2e: {
      baseUrl: 'http://localhost:3000',                // 链接本地开发
      // baseUrl: 'https://www.kucoin.com', // 链接生产环境
      // baseUrl: 'https://nginx-web-03.sit.kucoin.net'   // 链接测试环境(主站)
      // baseUrl: 'https://site-03.tr.sit.kucoin.net'   // 链接测试环境(土耳其站)
      // baseUrl: 'https://site-03.th.sit.kucoin.net'   // 链接测试环境(泰国站)
    },
  },
  teamsId: '19:42d6cdfb8e394675a2293f59f5af04e6@thread.v2', // 上报的teams群ID，使用(@kufox :u2)获取ID
  alarm_group: 'SEO前端值班组',
  router: {                                               //  路由卡点配置
    variableName: 'default',                              //  读取变量 default: 为 export default 默认导出的数组，具体变量名
    path: 'src/router.config.js'                          //  读取的路由文件
  }
};
