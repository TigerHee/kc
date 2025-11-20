/**
 * Owner: hanx.wei@kupotech.com
 */
// preload 之后的 css rel 会被修改为 stylesheet，这里改回去，并且修复引号转义的问题
/**
 * base-web 源码
 * <link rel="preload" href="%REACT_APP_CDN%/natasha/npm/@kux/font/css.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
 * 编译后
 * <link rel="preload" href="https://assets.staticimg.com/natasha/npm/@kux/font/css.css" as="style" onload='this.onload=null,this.rel="stylesheet"'>
 * puppeteer content 获取的
 * <link rel="stylesheet" href="https://assets.staticimg.com/natasha/npm/@kux/font/css.css" as="style" onload="this.onload=null,this.rel=&quot;stylesheet&quot;">
 */
function handlePreloadedCSSLink(content) {
  const reg =
    /<link([^>]*?\s)rel="[^"]*?"([^>]*?\s)onload="this\.onload=null[^"]*?"([^>]*?)>/gi;
  return content.replace(reg, (_, p1, p2, p3) => {
    return `<link${p1}rel="preload"${p2}onload="this.onload=null,this.rel='stylesheet'"${p3}>`;
  });
}

module.exports = handlePreloadedCSSLink;
