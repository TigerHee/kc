/**
 * Owner: hanx.wei@kupotech.com
 */
// 移除 head 中动态插入的 script 和 css，不移除页面本身 umi 打包的 css 避免 ssg 首屏样式丢失
async function removeHeadPreloadedResources(page, patterns) {
  await page.evaluate(patterns => {
    const removeHtmlElements = elements => {
      while (elements.length !== 0) {
        const ele = elements.pop();
        ele && ele.remove();
      }
    };
    const allScripts = Array.from(document.querySelectorAll('head script'));
    const filtedScripts = allScripts.filter(script => {
      return patterns.some(patternStr => script.src.includes(patternStr));
    });
    removeHtmlElements(filtedScripts);

    // 移除 react-helmet 动态创建的标签
    const helmetLinks = Array.from(
      document.querySelectorAll('head link[data-react-helmet="true"]')
    );
    // const helmetMetas = Array.from(document.querySelectorAll('meta[data-react-helmet="true"]'));
    removeHtmlElements([ ...helmetLinks ]);
  }, patterns);
}

module.exports = removeHeadPreloadedResources;
