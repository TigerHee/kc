/**
 * Owner: borden@kupotech.com
 */
import { pull } from 'tools/request';

const nameSpace = '/speedy';

// 检查是否支持币币闪兑
export const checkSupportFlashTrade = (params) => {
  return pull(`${nameSpace}/common/valid/enter/${params?.coin}`);
};

// 获取kyc3交易限制提示信息
export const getLimitKlines = (data) => {
  return pull('/flash-convert/limit/klines', data);
};

// 获取闪兑基本配置信息
export const getConvertBaseConfig = () => {
  return pull('/speedy/config/base');
};
