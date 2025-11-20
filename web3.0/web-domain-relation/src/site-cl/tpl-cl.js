const baseConfig = {
  // 独立站品牌域名，配置固定不变
  BRAND_ORIGIN: 'www.kucoinauth.com',
  /** 入口地址，同文件名 */
  MAIN_HOST: 'https://{host}',
  /** 主站地址 */
  MAINSITE_HOST: 'https://{host}',
  /** KuCoin地址 */
  KUCOIN_HOST: 'https://{host}',
  /** KuCoin国内站地址 */
  KUCOIN_HOST_CHINA: 'https://{host}',
  /** KuMEX地址 */
  KUMEX_HOST: 'https://{host}/futures',
  /** KuMEX简约版地址 */
  KUMEX_BASIC_HOST: 'https://{host}/futures/lite',
  /** PoolX地址 */
  POOLX_HOST: 'https://{host}/earn',
  /** PoolX M站地址 */
  M_POOLX_HOST: 'https://{host}/earn-h5',
  /** trade 地址 */
  TRADE_HOST: 'https://{host}/trade',
  /** trade-v2 地址 */
  TRADE_V2_HOST: 'https://{host}/trade',
  /** 文档 地址 */
  DOCS_HOST: 'https://{host}/docs',
  /** 沙盒模拟 地址 */
  SANDBOX_HOST: 'https://{host}',
  /** 流量落地页 地址 */
  LANDING_HOST: 'https://{host}/land',
  /** 一键买币项目 地址 */
  FASTCOIN_HOST: 'https://{host}/express',
  /** token-info 地址 */
  TOKEN_INFO_HOST: 'https://{host}/token-info',
  /** 机器人交易 地址 */
  ROBOT_HOST: 'https://{host}/trading-bot',
  /** 机器人新地址 */
  TRADING_BOT_HOST: 'https://{host}/trading-bot',
  /** kucoin-h5 地址 */
  M_KUCOIN_HOST: 'https://{host}',
  /** 合约sandbox */
  KUMEX_SANDBOX_HOST: 'https://{host}/futures',
  /** 合约网关 */
  KUMEX_GATE_WAY: 'https://{host}/_api_kumex',
  /** 商家后台 - 项目方 地址 */
  ASSET_HUB_HOST: 'https://assethub.kucoin.{tld}',
  // 历史 K 线数据下载
  HISTORICAL_DATA_HOST: 'https://historical-data.kucoin.{tld}',
  // 主站地址
  KC_SITE_HOST: 'https://www.kucoin.com',
  // 泰国站地址
  TH_SITE_HOST: 'https://www.kucoin.th',
  // 土耳其站地址
  TR_SITE_HOST: 'https://www.kucoin.tr',
};

export default baseConfig;
