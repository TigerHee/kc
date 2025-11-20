const baseConfig = {
  /** 入口地址，同文件名 */
  MAIN_HOST: 'https://www.kucoin.{tld}',
  /** 主站地址 */
  MAINSITE_HOST: 'https://www.kucoin.{tld}',
  /** KuCoin地址 */
  KUCOIN_HOST: 'https://www.kucoin.{tld}',
  /** KuCoin国内站地址 */
  KUCOIN_HOST_CHINA: 'https://www.kucoin.{tld}',
  /** KuMEX地址 */
  KUMEX_HOST: 'https://www.kucoin.{tld}/futures',
  /** KuMEX简约版地址 */
  KUMEX_BASIC_HOST: 'https://www.kucoin.{tld}/futures/lite',
  /** PoolX地址 */
  POOLX_HOST: 'https://www.kucoin.{tld}/earn',
  /** PoolX M站地址 */
  M_POOLX_HOST: 'https://www.kucoin.{tld}/earn-h5',
  /** trade 地址 */
  TRADE_HOST: 'https://www.kucoin.{tld}/trade',
  /** trade-v2 地址 */
  TRADE_V2_HOST: 'https://trade-v2.kucoin.{tld}',
  /** 文档 地址 */
  DOCS_HOST: 'https://www.kucoin.{tld}/docs',
  /** 沙盒模拟 地址 */
  SANDBOX_HOST: 'https://sandbox.kucoin.{tld}',
  /** 流量落地页 地址 */
  LANDING_HOST: 'https://www.kucoin.{tld}/land',
  /** 一键买币项目 地址 */
  FASTCOIN_HOST: 'https://www.kucoin.{tld}/express',
  /** token-info 地址 */
  TOKEN_INFO_HOST: 'https://www.kucoin.{tld}/token-info',
  /** 机器人交易 地址 */
  ROBOT_HOST: 'https://robot.kucoin.{tld}',
  /** 机器人新地址 */
  TRADING_BOT_HOST: 'https://www.kucoin.{tld}/trading-bot',
  /** kucoin-h5 地址 */
  M_KUCOIN_HOST: 'https://www.kucoin.{tld}',
  /** 合约sandbox */
  KUMEX_SANDBOX_HOST: 'https://sandbox-futures.kucoin.{tld}',
  /** 合约网关 */
  KUMEX_GATE_WAY: 'https://www.kucoin.{tld}/_api_kumex',
  /** 商家后台 - 项目方 地址 */
  ASSET_HUB_HOST: 'https://assethub.kucoin.{tld}',
  // 历史 K 线数据下载
  HISTORICAL_DATA_HOST: 'https://historical-data.kucoin.{tld}',
  // 支付 pci 独立接口域名
  PAY_PCI_HOST: 'https://paypci.kucoin.{tld}',
  // 下面写死的变量是为了在站点之间互相跳转时使用，不要使用 {tld} 替换
  // 泰国站地址
  TH_SITE_HOST: 'https://www.kucoin.th',
  // 土耳其站地址
  TR_SITE_HOST: 'https://www.kucoin.tr',
  // 清退站地址
  CL_SITE_HOST: 'https://www.kucoinauth.com',
};

export default baseConfig;
