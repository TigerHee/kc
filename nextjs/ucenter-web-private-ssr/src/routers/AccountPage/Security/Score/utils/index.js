/** 风控要求的浏览器类型，只支持 chrome 和 edge */
export function getBrowserType() {
  const userAgent = window?.navigator?.userAgent?.toLowerCase() ?? '';
  if (userAgent.indexOf('chrome') > -1) {
    return 'CHROME';
  }
  if (userAgent.indexOf('edge') > -1) {
    return 'EDGE';
  }
  return '';
}

/** 风控要求的浏览器插件列表 */
export function getChromeExtensions() {
  try {
    return Array.from(document.scripts)
      .filter((script) => script.src.includes('chrome-extension'))
      .map((script) => script.src);
  } catch (err) {
    console.error(err);
    return [];
  }
}
