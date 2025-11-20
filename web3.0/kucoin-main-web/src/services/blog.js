/**
 * Owner: willen@kupotech.com
 */
import { pull } from 'tools/request';
import config from 'config';

const {
  v2ApiHosts: { CMS },
} = config;

/**
 * blog列表
 */
export async function pullArticles(payload) {
  return pull(`${CMS}/cms/articles`, payload);
}

/**
 * 文章详情
 * @param path 文章路由
 */
export async function pullArticleDetail(path) {
  return pull(`${CMS}/cms/articles/${path}`, { type: 3 });
}

/**
 * 热门文章列表
 */
export async function pullHotArticles(payload) {
  return pull(`${CMS}/cms/articles/hot`, payload);
}

/**
 * blog标签
 */
export async function pullArticlesTags(payload) {
  return pull(`${CMS}/cms/articles/tags`, payload);
}

/**
 * blog 分类
 * type 分类类型：1 公告，2 系统页面，3 Blog
 */
export async function pullArticlesCategories(payload) {
  return pull(`${CMS}/cms/category`, { ...payload, type: 3 });
}
