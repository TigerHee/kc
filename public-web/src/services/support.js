/**
 * Owner: willen@kupotech.com
 */
import { zElanguages, zendeskApiPrefix } from 'config/base';
import { getCurrentLangFromPath } from 'tools/i18n';
import { pull } from 'tools/request';

const prefix = zendeskApiPrefix;
// 调用本地zendesk-api
// const prefix = 'http://localhost:3030';

const lang = getCurrentLangFromPath();
export const requestLang = zElanguages[lang] || 'en-us';

export function getCategories(params) {
  return pull(`${prefix}/api/v2/help_center/${requestLang}/categories.json?per_page=100`, params);
}

export function getSections(id, per_page = 100) {
  return pull(
    `${prefix}/api/v2/help_center/${requestLang}/categories/${id}/sections.json?per_page=${per_page}`,
  );
}

export function getArticlesBySectionsId(id) {
  return pull(
    `${prefix}/api/v2/help_center/${requestLang}/sections/${id}/articles.json?per_page=100`,
  );
}

export function getAllArticles({ pageSize, page }) {
  return pull(
    `${prefix}/api/v2/help_center/${requestLang}/articles.json?per_page=${pageSize}&page=${page}`,
  );
}

export function getSectionById(section_id) {
  return pull(`${prefix}/api/v2/help_center/${requestLang}/sections/${section_id}`);
}

export function getSearchData({ categoryId, query, pageSize, pageAfter, pageBefore }) {
  const params = `${categoryId ? `&filter[category_ids]=${categoryId}` : ''}${
    pageAfter ? `&page[after]=${pageAfter}` : ''
  }${pageBefore ? `&page[before]=${pageBefore}` : ''}`;
  return pull(
    `${prefix}/api/v2/guide/search?filter[locales]=${requestLang}&query=${query}&page[size]=${pageSize}${params}`,
  );
}

export function getArticlesSearch({ page, pageSize, query }) {
  return pull(
    `${prefix}/api/v2/help_center/articles/search?per_page=${pageSize}&page=${page}&locale=${requestLang}&query=${query}`,
  );
}

export function getArticlesById(id, lang) {
  const rLang = lang ? zElanguages[lang] : requestLang;
  return pull(`${prefix}/api/v2/help_center/${rLang}/articles/${id}.json`);
}

// ada和zendesk配置查询, 目前仅针对app的开关， web不做开关
export function getAdaConfig() {
  return pull('/intelligent-service/config/query');
}

// 获取jwt token， 传给zendesk，记录用户信息元变量
export function getJwtToken() {
  return pull('/intelligent-service/auth/createdJWT');
}

// 获取充值未到账的配置
export const getConfig = (params) => {
  // 老接口
  // return pull(`/intelligent-service/config/query/easy/kvConfig`, params);
  // 新接口
  return pull(`/intelligent-service/config/query/entrance/config`, params);
};

// 根据ip获取地址
export const getIpByCountry = () => {
  return pull('/platform-reward/get-ip-by-country');
};

/**
 * 获取热门文章
 */
export const getPopularArticles = () => {
  return pull('/intelligent-service/helpCenter/popularArticles');
};
