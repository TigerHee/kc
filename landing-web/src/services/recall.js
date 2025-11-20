/**
 * Owner: jesse.shao@kupotech.com
 */
import { post } from 'utils/request';

const prefix = '/market-operation';

// 邮箱召回
export const postEmailRecall = payload => post(`${prefix}/recalled-email`, payload);

// 手机召回
export const postPhoneRecall = payload => post(`${prefix}/recalled-phone`, payload);
