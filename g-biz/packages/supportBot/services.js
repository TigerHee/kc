/**
 * Owner: odna.ou@kupotech.com
 */
import { get } from '@tools/request';

/**
 * 获取Bot口配置
 */
export const getBotConfigList = () => {
  return get('/intelligent-service/entry/list');
};

// /**
//  * 获取入口配置信息接口
//  * @param {{
//  *  source: string
//  * }} query
//  */
// export const getConnectConf = (query) => {
//   return get('/intelligent-service/entry/configDetail', query);
// };
