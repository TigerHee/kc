/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull } from 'utils/request';

const prefix = '/kucoin-config';

// 获取4周年配置
export const getAnniversaryConfig = () => pull(`${prefix}/anniversary-config`);

// 获取服务器时间
export const getServerTime = () => pull(`/timestamp`);
