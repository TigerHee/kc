/**
 * Owner: willen@kupotech.com
 */
import xss from "xss";

export const DEFAULT_SEO_SUFFIX = "KuCoin";
export function matchReg(str) {
  const reg = /<\/?.+?\/?>/g;
  if (!str) str = "";
  return str.replace(reg, "");
}


// 获取一段html中的文本部分
export function getTextFromHtmlString(html: string) {
  // 配置 xss，设置 whiteList 为空以移除所有标签
const options = {
  whiteList: {}, // 空白名单，表示不允许任何标签
  stripIgnoreTag: true, // 移除白名单外的标签
  stripIgnoreTagBody: true, // 移除白名单外标签及其内容
};

const cleanedText = xss(html, options);
return cleanedText.trim();
}
