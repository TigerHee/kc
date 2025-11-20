module.exports = {
  cypress: {
    e2e: {
      baseUrl: 'http://localhost:8000',
      // baseUrl: 'https://www.kucoin.com',
      // baseUrl: 'https://www.kucoin.th',
      // baseUrl: 'https://www.kucoin.tr',
      // baseUrl: 'https://nginx-web-09.sit.kucoin.net'
    },
  },
  teamsId: '19:ebc8a72e5cf0403387ccf884d571fe3f@thread.v2',
  router: {
    //  路由卡点配置
    variableName: 'default', //  读取变量 default: 为 export default 默认导出的数组，具体变量名
    path: 'src/router.config.js', //  读取的路由文件
    exclude: [
      '/aptp', // 这些都是重定向的页面忽略掉
      '/aptp/myOrder', // 这些都是重定向的页面忽略掉
      '/spotlight7/:id?', // 活动暂未上线 忽略
      '/spotlight7/purchase-record/:recordId?', // 活动暂未上线 忽略
      '/spotlight_r8/:id?', // 活动暂未上线 忽略
      '/spotlight_r8/purchase-record/:recordId?', // 活动暂未上线 忽略
      // todo 结构化协议，暂时忽略
      '/legal/au-earn-structured-agreement',
      '/legal/au-earn-snowball-agreement',
      '/legal/au-earn-shark-fin-agreement',
      '/legal/au-earn-dual-agreement',
      '/legal/au-earn-twin-win-agreement',
      '/legal/au-earn-convert-plus-agreement',
      '/legal/au-earn-future-plus-agreement',
      '/legal/au-earn-range-bound-agreement',
      '/convert',
    ],
  },
  alarm_group: 'public-web值班组',
};
