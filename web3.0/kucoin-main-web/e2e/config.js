module.exports = {
  cypress: {
    e2e: {
      // baseUrl: 'http://localhost:8000',
      baseUrl: 'https://www.kucoin.com',
      // baseUrl: 'https://nginx-web-09.sit.kucoin.net'
    },
  },
  teamsId: '19:ea9f23e2d65f4375b516610677ac8682@thread.v2',
  alarm_group: 'kucoin-main-web值班组',
  router: {
    //  路由卡点配置
    variableName: 'default', //  读取变量 default: 为 export default 默认导出的数组，具体变量名
    path: 'src/routes.config.js', //  读取的路由文件
    exclude: [
      '/beginner-zone',
      '/beginner-zone/rule',
      '/assets/bonus',
      '/assets/bonus/rewards',
      '/activity-center',
      '/staking', // staking -> earn/staking,
      '/listing/apply', // listing/apply -> listing,
      '/new-cryptocurrencies', // new-cryptocurrencies -> markets/new-cryptocurrencies,
      '/records-v1', // records-v1 -> assets/record
      '/nft-token/intro', // nft-token/intro -> spot-nft/collection
      '/spot-nft/igo', // spot-nft/igo -> /spot-nft/collection
      '/spot-nft/pikaster', // spot-nft/pikaster -> /spot-nft/collection
      '/spot-nft/main', // spot-nft/main -> /spot-nft/collection
      '/spot-nft/distribute/:id', // spot-nft/distribute/:id -> /spot-nft/collection
      '/spot-nft/project/:id', // spot-nft/project/:id -> /spot-nft/collection
      '/spot-nft/project/:id/:index/token', // spot-nft/project/:id/:index/token -> /spot-nft/collection
      '/spot-nft/project/:id/:index/:type', // spot-nft/project/:id/:index/:type -> /spot-nft/collection
      '/spot-nft/token-sell/:currency/:index', // spot-nft/token-sell/:currency/:index -> /spot-nft/collection
      '/r/af/:code',
      '/r/rf/:code',
      '/r/:code',
      '/spotlight/:id' // land/spotlight_r5/:id
    ], // 这些都是重定向的页面忽略掉
  },
};
