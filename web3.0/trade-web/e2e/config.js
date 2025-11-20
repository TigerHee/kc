module.exports = {
  cypress: {
    e2e: {
      // baseUrl: 'http://localhost:8000', // 链接本地开发
      baseUrl: 'https://www.kucoin.tr', // 链接生产环境
      // baseUrl: 'https://site-02.tr.sit.kucoin.net/', // 链接测试环境
    },
  },
  teamsId: '19:d434dfe5874b403993cb2365d2b6eca5@thread.v2', // 上报的teams群ID，使用(@kufox :u2)获取ID
  router: {
    //  路由卡点配置
    variableName: 'default', //  读取变量 default: 为 export default 默认导出的数组，具体变量名
    path: 'src/routes.config.js', //  读取的路由文件
  },
};
