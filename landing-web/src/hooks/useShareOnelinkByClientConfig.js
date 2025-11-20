/**
 * Owner:melon@kupotech.com
 */

import { useEffect, useState } from 'react';
import { pull } from 'utils/request';

/**
 * 页面配置
 * @param {{ businessLine: string; codes:string }} params
 * @returns
 */
export const pullPageConfigItems = async (params) => {
  return pull(`/growth-config/get/client/config/codes`, params);
};

/**
 * 获取页面配置项
 */
export function getPageConfig({ codes, businessLine = 'toc' }) {
  return pullPageConfigItems({ codes, businessLine })
    .then((data) => {
      return { ...data.data };
    })
    .catch((data) => {
      return {};
    });
}

/**
 * 通过页面配置项获取对应配置的值
 * @param {string} param.codes 配置编码 支持多个使用,分隔开 例如webHomepageDownload,webHomepageData
 * @param {string} param.businessLine 渠道
 * @param {string} param.linkCode 需要获取跳转链接的标识码 例如webHomepageDownload，就只会拿webHomepageDownload配置的jumpUrl
 * @param {string} param.defaultUrl 默认兜底url
 *
 * @returns shareOnelink 返回配置的分享onelink链接
 */
export function useShareOnelinkByClientConfig({ codes = '', businessLine = undefined, linkCode='', defaultUrl=undefined }) {
  /** 分享onelink */
  const [shareOnelink, setShareOnelink] = useState(defaultUrl);
  const pullShareOnelink = () => {
    getPageConfig({ codes, businessLine, linkCode })
      .then((data) => {
        const items = data?.properties || [];
        const pageConfigItems = items.reduce((acc, cur) => {
          acc[cur.property] = cur;
          return acc;
        }, {});
        const link = (pageConfigItems[linkCode] || {}).jumpUrl;
        setShareOnelink(link || defaultUrl);
      })
      .catch((error) => {
        setShareOnelink(defaultUrl);
      })
      .finally(() => {});
  };
  useEffect(() => {
    pullShareOnelink();
  }, []);

  return { shareOnelink };
}
