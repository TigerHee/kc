/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-06-12 17:25:10
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-09-09 14:09:01
 * @FilePath: /trade-web/src/services/cms.js
 * @Description:
 */
/**
 * Owner: borden@kupotech.com
 */
import _ from 'lodash';
import { pull } from 'utils/request';
import { getTimeStampOnHour, getCmsCdnHost } from 'helper';

const CMS = _API_HOST_;
/**
 * 组件列表
 */
export async function pullComponents(keys) {
  /* {
  "success": true,
  "code": 0,
  "msg": "string",
  "timestamp": 0,
  "items": [
    {
      "key": "string", // key
      "compiled_html": "string", // 编译后的HTML
      "location": 0, // 1body，2head
    }
  ]
} */
  const param = `keys=${JSON.stringify(keys)}`;
  return pull(`${CMS}/cms/components?${param}`);
}

/**
 * 获取热门搜索交易对
 * @param quote string 交易市场
 */
export async function getHotMarketSymbols() {
  return pull(`${CMS}/cms/hot-search-coins`);
}


export async function pullCmsCDN(cmptname, lang = 'en_US') {
  const t = getTimeStampOnHour(-6);
  const cdnhost = getCmsCdnHost();
  return fetch(`${cdnhost}/h_${cmptname}_${lang}.json?t=${t}`);
}
