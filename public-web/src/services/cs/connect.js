/**
 * Owner: odan.ou@kupotech.com
 */
// 帮助中心联系客服

import { pull } from 'tools/request';

const ServiceName = '/intelligent-service';

/**
 * 获取入口配置信息接口
 * @param {{
 *  source: string
 * }} query
 */
export const getConnectConf = (query) => {
  return pull(`${ServiceName}/entry/configDetail`, query);
};
