/**
 * Owner: garuda@kupotech.com
 * 定义 css loader modules
 */

import MD5 from 'crypto-js/md5';

const genMd5 = (context, length) => {
  return MD5(context).toString().slice(0, length);
};

const cssModuleGetIndentName = (context, localName) => {
  const name = genMd5(context.context, 5);
  return `${localName}__${name}`;
};

module.exports = {
  // 自定义 css module 类名，兼容 theme.less 文件
  getLocalIdent: (context, localIdentName, localName, options) => {
    return cssModuleGetIndentName(context, localName);
  },
  // 自定义 css modules 的开启，当文件为 css 文件时，统一不开启 modules
  auto: (resourcePath) => {
    if (resourcePath && resourcePath.endsWith('.css')) {
      return false;
    }
    return true;
  },
};
