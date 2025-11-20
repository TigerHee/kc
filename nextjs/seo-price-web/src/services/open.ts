/**
 * Owner: willen@kupotech.com
 */
import { pull } from 'gbiz-next/request';

// 获取系统可用语言列表
export async function getLangList() {
  return pull('/kucoin-config/web/international/config-list');
}

// 获取服务器时间
export async function getServerTime() {
  return pull('/timestamp');
}

// 获取国家码等信息
export async function getCountryInfo() {
  return pull('/ucenter/locale');
}

// 根据appId获取后台配置
export async function getGrowthConfig(params) {
  return pull('/growth-config/get/white/config', params);
}
