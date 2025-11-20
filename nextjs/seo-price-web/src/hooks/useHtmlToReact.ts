/**
 * Owner: chelsey.fan@kupotech.com
 */
import { useMemo } from "react";
import HtmlToReact from 'html-to-react';
import { FilterXSS, whiteList} from "xss";
import cssfilter from "cssfilter";
import { getTenantConfig } from "@/config/tenant";

// 是否渲染链接
// 多租户本地站的文章内链接不渲染
const isEnableLinkRendering = getTenantConfig().showArticleInternalLink;

const xssWhitelist = {
  ...whiteList,
};

const { a, ...whiteListWithoutA } = xssWhitelist;


export const commonXssOptions = {
  whiteList: xssWhitelist,
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script'],
  onTagAttr: function (tag, name, value, isWhiteAttr) {
    if (tag === 'span' && name === 'data-announcement-sub-id') return `${name}="${value}"`;
  },
  onIgnoreTagAttr: function (_, name, value) {
    if (name === 'style') {
      return name + '="' + cssfilter(value) + '"';
    }
  },
};

const xssfilter = new FilterXSS(commonXssOptions);
const xssFilterWithoutRenderingATag = new FilterXSS(Object.assign(commonXssOptions, { whiteList: whiteListWithoutA }));

export const getHtmlToReact = (html,checkTenantATagRendering) => {
  const { Parser } = HtmlToReact;
  const htmlToReactParser = new Parser();
  let _filter = xssfilter;

  // 要检测a标签
  // 租户配置不渲染内链时
  if (checkTenantATagRendering && !isEnableLinkRendering) {
      // 使用不渲染a tag的filter
      _filter = xssFilterWithoutRenderingATag;
  }

  const h = htmlToReactParser.parse(_filter.process(html));

  return h;
};

const useHtmlToReact = ({ html, checkTenantATagRendering = false }) => {

  const eles = useMemo(() => {
    return getHtmlToReact(html, checkTenantATagRendering);
  }, [checkTenantATagRendering, html])

  return {
    eles,
  };
};
export default useHtmlToReact;
