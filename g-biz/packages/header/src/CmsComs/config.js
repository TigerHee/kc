/**
 * Owner: iron@kupotech.com
 */
/**
 * CMS 组件配置 router => [keys...]
 *  keys为不含语言的前缀部分
 */
export const CmsComponents = {
  /** 通用 */
  _: ['com.newheader.logo'],
  combine: ['com.newheader.logo'],
};

// 默认语言
export const DEFAULT_LANG = window._DEFAULT_LANG_ || 'en_US';
export const getCmsCdnHost = () => 'https://assets.staticimg.com/cms-static';
