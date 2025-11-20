/**
 * Owner: odan.ou@kupotech.com
 */
import { postJson } from 'utils/request';
// K线个性化
const KineLineType = 1;
// 快速下单
const QuickOrderType = 2;
// 新版交易大厅K线个性化
export const KineLineTypeNew = 10;

/**
 * 获取公用数据symbol key
 */
export const CommonConfSymbol = 'ALL-ALL';

const getUrl = (path) => `/kline-data-check/${path}`;

const post = (url, params, ...args) => {
  const { userid, ...others } = params || {};
  return postJson(
    url,
    others,
    {
      headers: {
        'X-USER-ID': userid,
      },
    },
    ...args,
  );
};

/**
 * 更新用户配置信息
 * @param {{
 *  pri_dict_value: string,
 *  sec_dict_value: string,
 *  symbol: string,
 *  userid: any,
 *  type: number,
 * }} params
 */
export const updateUserConf = (params) => {
  return post(getUrl('user-config'), params);
};

/**
 * 查询用户配置
 * @param {{
 *  pri_dict_value: string,
 *  sec_dict_value: string,
 *  symbol: string[],
 *  userid: any,
 *  type: number,
 * }} params
 */
export const getUserConf = (params) => {
  return post(getUrl('user-config/query'), params);
};

/**
 * 更新用户K线配置
 * @param {{
 *  pri_dict_value: string,
 *  sec_dict_value: string,
 *  symbol: string,
 *  userid: any,
 * }} params
 */
export const updateUserKlineConf = (params) => {
  return updateUserConf({
    symbol: CommonConfSymbol,
    type: KineLineType,
    ...params,
  });
};

/**
 * 获取用户K线配置
 * @param {{
 *  pri_dict_value: string,
 *  sec_dict_value: string,
 *  symbol: string[],
 *  userid: any,
 * }} params
 */
export const getUserKlineConf = (params) => {
  return getUserConf({
    type: KineLineType,
    ...params,
  });
};

/**
 * 更新用户快速下单配置
 * @param {{
 *  pri_dict_value: string,
 *  sec_dict_value: string,
 *  userid: any,
 * }} params
 */
export const updateUserQuickOrderConf = (params) => {
  return updateUserConf({
    ...params,
    symbol: CommonConfSymbol,
    type: QuickOrderType,
  });
};

/**
 * 获取用户快速下单配置
 * @param {{
 *  pri_dict_value: string,
 *  sec_dict_value: string,
 *  userid: any,
 * }} params
 */
export const getUserQuickOrderConf = (params) => {
  return getUserConf({
    ...params,
    symbol: [CommonConfSymbol],
    type: QuickOrderType,
  });
};
