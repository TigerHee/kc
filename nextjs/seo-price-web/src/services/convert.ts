/**
 * Owner: willen@kupotech.com
 */
import { pull } from 'gbiz-next/request';

// export const isTdConvert = () => {
//   const url = urlParser.parse(location.href);
//   const params = url?.query?.params || {};
//   return !params?.switcher;
// };

// const nameSpace = isTdConvert() ? '/speedy' : '/flash-trade';

// // 检查是否支持币币闪兑
// export const checkSupportFlashTrade = (params) => {
//   return pull(`${nameSpace}/common/valid/enter/${params?.coin}`);
// };

// 获取购买交易对
export const fetchExpressSymbols = () => {
  return pull(`/payment-api/pmtapi/v1/symbols?platform=KUCOIN&version=v2`);
};
