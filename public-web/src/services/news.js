/**
 * Owner: willen@kupotech.com
 */
import config from 'config';
import { post, pull } from 'tools/request';

const {
  v2ApiHosts: { CMS },
} = config;

/**
 * 文章列表
 */
export async function pullArticles({ page, pageSize, category, keyword, withContent }) {
  /* {
    "success": true,
    "code": 0,
    "msg": "string",
    "timestamp": 0,
    "totalNum": 0,
    "items": [
      {
        "id": 0,
        "title": "string",
        "summary": "string",
        "path": "string",
        "images": [
          "string"
        ],
        "hot": 0,
        "stick": 0,
        "publish_at": "string"
      }
    ]
  } */
  const param = {
    page,
    pageSize,
    category,
    keyword,
  };
  if (typeof withContent !== 'undefined') {
    param.withContent = withContent;
  }
  return pull(`${CMS}/cms/articles`, param);
}

export async function pullBlogArticles({ page, pageSize }) {
  return pull(`${CMS}/cms/articles`, { page, pageSize, type: 3 });
}

/**
 * 文章详情
 * @param path 文章路由
 */
export async function pullArticleDetail(path) {
  /* {
    "success": true,
    "code": 0,
    "msg": "string",
    "timestamp": 0,
    "data": {
      "id": 0,
      "title": "string",
      "summary": "string",
      "path": "string",
      "images": [
        "string"
      ],
      "hot": 0,
      "stick": 0,
      "publish_at": "string"
    }
  } */
  return pull(`${CMS}/cms/articles/${path}`);
}

/**
 * 热门文章列表
 */
export async function pullHotArticles() {
  /* {
    "success": true,
    "code": 0,
    "msg": "string",
    "timestamp": 0,
    "items": [
      {
        "id": 0,
        "title": "string",
        "summary": "string",
        "path": "string",
        "images": [
          "string"
        ],
        "hot": 0,
        "stick": 0,
        "publish_at": "string"
      }
    ]
  } */
  return pull(`${CMS}/cms/articles/hot`);
}

/**
 * 获取广告列表
 *
 * @returns {Object}
 */
export const getAds = (payload) => {
  return pull(`${CMS}/cms/ads`, payload);
};

/**
 * 获取活动列表
 *
 * @returns {Object}
 */
export const getActivities = (articleId) => {
  return pull(`${CMS}/cms/articles/${articleId}/subscribe`);
};

/**
 * 取消订阅活动
 *
 * @returns {Object}
 */
export const unsubscribe = ({ articleId, activity }) => {
  return post(`${CMS}/cms/articles/${articleId}/unsubscribe`, activity, false, true);
};

/**
 * 订阅活动
 *
 * @returns {Object}
 */
export const subscribe = ({ articleId, activity }) => {
  return post(`${CMS}/cms/articles/${articleId}/subscribe`, activity, false, true);
};
