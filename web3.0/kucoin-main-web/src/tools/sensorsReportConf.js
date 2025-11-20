/*
 * @Owner: willen@kupotech.com
 * @Author: willen willen@kupotech.com
 * @Date: 2023-05-13 19:23:03
 * @LastEditors: Melon Melon@kupotech.com
 * @LastEditTime: 2025-05-26 11:46:56
 * @FilePath: /kucoin-main-web/src/tools/sensorsReportConf.js
 * @Description:
 *
 *
 */
import sensors from '@kucoin-base/sensors';
import { _DEV_, IS_TEST_ENV } from '../utils/env';

export const siteId = 'kcWeb';

export const pageIdMap = {
  '/assets/futures-account/trade-history': 'B5FuturesTradeHistory', // 合约交易历史
  '/assets/futures-account/order-history': 'B5FuturesOrderHistory', // 合约历史委托

  '/assets/coin': 'B1deposit',
  '/assets/coin/:coin': 'B1depositOrder',
  '/assets': 'B1assets',
  '/assets/withdraw': 'B1withdraw',
  '/assets/withdraw/:coin': 'B1withdraw',
  '/assets/margin-account': 'B4marginAccount',
  '/assets/margin-account/margin': 'B4marginAccount',
  '/assets/margin-account/isolated': 'B4marginAccount',
  '/assets/bonus/loans': 'B4InterestFreeCoupon',
  '/assets/bonus/margin-bonus': 'B4marginBonus',
  '/account/kyc': 'B1KYCHomepage',
  '/account/kyc/introduce': 'B1KYCIntroduce',
  '/account/kyc/personal-kyc1-info': 'B1KYC1InfoReview',
  '/account/kyc/personal-kyc1': 'B1KYC1Edit',
  '/account/kyc/app-kyc': 'B1KYC2TransApp',
  '/account/kyc/result': 'B1KYC2SubmitResult',
  '/fast-coin/order/:id': 'B7CreditCardStatusPage',
  '/assets/fiat-currency/recharge': 'B7FiatDeposit',
  '/assets/fiat-currency/recharge/confirm/plaid': 'B7FiatDetailConfirm',
  '/assets/fiat-currency/plaid-result': 'B7DepositResult',
  '/assets/fiat-currency/recharge/:id': 'B7DepositStatusPage',

  '/assets/payments': 'B7ThirdParty',
  '/assets/order': 'B7ThirdPartyOrders',
  '/new-cryptocurrencies': 'B5newcoinarea',
  '/assets/trade-account': 'B5tradeAccount',
  '/account/kyc/personal-kyc2': 'B1KYC2ManuelUpload',
  '/account/kyc/personal-kyc2-jumio': 'B1KYC2JumioVerify',
  '/referral': 'B3Referral2',
  '/referral/detail': 'B3Referral2History',
  '/content-creator-program': 'B3creator',
  '/order/trade/convert': 'BSfastTradeHistory',
  '/withdraw-addr-manage': 'B1withdrawAddrManage',
  '/assets/record': 'B1assetsRecord',
  '/careers': 'B1JoinUs', // 加入我们

  // 个人设置
  '/spot-nft/igo': 'B5igoProject', // IGO项目页
  '/spot-nft/distribute/:id': 'B5igoSellOrAuction', // 项目售卖页或拍卖页
  //新手专区
  '/beginner-zone': 'B1newBieZoneV2',
  '/spot-nft/project/:id/:index/:type': 'B5igoSellOrAuction', // 项目售卖页或拍卖页
  '/spot-nft/project/:id/:index/token': 'B5Fragtokensale', // token售卖
  // nft token相关
  '/nft-token/intro': 'B5Fragtokenmain',
  '/spot-nft/token-sell/:symbol/:index': 'B5Fragtokensale', // token售卖（admin配置版）
  // 资产界面
  '/assets/bonus/encouragement': 'BLEncouragement', // 鼓励金页面
  // 资产证明
  '/proof-of-reserves': 'B1porhome', // 资产证明主页
  '/proof-of-reserves/detail/:id': 'B1pordetail', // 资产证明详情页

  // 安全落地页
  '/security': 'B1securityBrand',

  // 子账户
  '/account/sub/history': 'B1SubLoginHistory',

  '/mining-pool': 'BWhomepage',
  '/bitcoin-halving': 'B2KuBTChalving',
};

export const sensorsConfig = {
  env: _DEV_ || IS_TEST_ENV ? 'development' : 'production',
  web_page_leave: true,
  abtest_url: `https://ab.kucoin.plus/api/v2/abtest/online/results?project-key=${
    _DEV_ || IS_TEST_ENV
      ? '36DBB03C8F0BA07957A1210633E218AA72F82017'
      : '002DF87B8629B86AC8A602E685FF6EE4CDA5BB0F'
  }`,
  log: IS_SANDBOX ? false : true,
  sdk_url: 'https://assets.staticimg.com/natasha/npm/sensorsdata/sensorsdata.min.js',
};

// 获取神策 ab 结果
export const getSensorsABResult = (options) => {
  const _config = options || {};
  if (sensors) {
    return sensors.fastFetchABTest(_config);
  }
  return Promise.resolve(_config.default_value);
};
