/**
 * Owner: iron@kupotech.com
 */
import { get, post } from '@tools/request';

// 获取系统可用语言列表
export function getLangList() {
  // return get('/ucenter/languages');
  return get('/kucoin-config/web/international/config-list');
}

// 退出登录
export const logout = () => {
  return post('/logout');
};

/**
 * 获取分类
 */
export function getClassify(params) {
  return get('/seo-front/homepage/classify-show', params)
    .then((res) => {
      return res.data || [];
    })
    .catch(() => []);
}

/**
 * 获取topic
 */
export function getTopic(params) {
  return get('/seo-front/topic-show', params)
    .then((res) => {
      return res.data || [];
    })
    .catch(() => []);
}

// 新获取分类接口
export function getNavItems(params) {
  return get('/seo-front/toc/topic/name', params)
    .then((res) => {
      return res.data || [];
    })
    .catch(() => []);
}

/**
 * 获取交易所实时的币种对法币的价格
 *
 * @param base    string 法币币种 如：USD
 * @param targets string 数字货币币种，用于过滤数据， 如：BTC,KCS,ETH，参数只返回这三项的数据
 */
export function getPrices(base = 'USD', targets = '') {
  return get('/currency/prices', { base, targets });
}
