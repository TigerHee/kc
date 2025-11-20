/**
 * Owner: Borden@kupotech.com
 */
import { get } from '@tools/request';

// 币服接口
export async function getCurrenciesMap(status) {
  return get('/kucoin-web-front/v2/transfer-currencies', {
    status,
    currencyType: 2,
    domainIds: 'kucoin',
  });
}

// 获取币种交易限制
// export async function getSymbols() {
//   return get('/currency/symbols');
// }

// 查询用户信息
export async function getUserInfo() {
  return get('/ucenter/user-info');
}
