/**
 * Owner: iron@kupotech.com
 */
/**
 * CMS 组件配置 router => [keys...]
 *  keys为不含语言的前缀部分
 */
export const CmsComponents = {
  /** 通用 */
  _: ['com.newheader.logo', 'com.newFooter.links', 'com.newFooter.copyright'],
  // 新版才用cdn 加载，将上面的几个组合成 com.commons
  combine: ['com.newheader.logo.new', 'com.newFooter.links.new', 'com.newFooter.copyright.new'],
};

// 默认语言
export const DEFAULT_LANG = window._DEFAULT_LANG_ || 'en_US';

export const getCmsCdnHost = () => 'https://assets.staticimg.com/cms-static';
