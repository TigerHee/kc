module.exports = {
  cypress: {
    e2e: {
      // baseUrl: 'http://localhost:8200',                // 链接本地开发
      // baseUrl: 'https://www.kucoin.com',                  // 链接生产环境
      baseUrl: 'https://www.kucoin.th',
      // baseUrl: 'https://www.kucoin.tr',
      // baseUrl: 'https://nginx-web-02.sit.kucoin.net'   // 链接测试环境
    },
    // 其他配置参考(https://docs.cypress.io/guides/references/configuration#__docusaurus_skipToContent_fallback)
  },
  teamsId: '19:6c23d501dec3494891bfd62374277580@thread.v2',                                             // 上报的teams群ID，使用(@kufox :u2)获取ID
  alarm_group: 'marketing-frontend',
  router: {                                               //  路由卡点配置
    variableName: 'routes',                              //  读取变量 default: 为 export default 默认导出的数组，具体变量名
    path: 'src/pages/.umi/router.js',                       //  读取的路由文件
    exclude: [], // 屏蔽路由
  }
};
