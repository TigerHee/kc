/**
 * Owner: willen@kupotech.com
 */
import { pull } from 'tools/request';
import config from 'config';

const {
  v2ApiHosts: { CMS },
} = config;

/**
 * 文章列表
 */
export async function pullArticles({ page, pageSize, category, keyword }) {
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
  return pull(`${CMS}/cms/articles`, {
    page,
    pageSize,
    category,
    keyword,
  });
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
 * 杠杆答题 答题json
 */
export async function pullMarginTradeExamContent() {
  return pull('/margin-config/inner/configs/margin-trading-exam');
}

/**
 * 杠杆答题 答题json
 */
export async function pullEtfExamContent() {
  return pull('/margin-fund/agreement/trading-exam');
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
