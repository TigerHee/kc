/**
 * Owner: hanx.wei@kupotech.com
 */
// 将 head 中动态插入的 script 移动到 body 后 (包括 locale 脚本)
async function moveBodyPreloadedResources(page, patterns) {
  await page.evaluate(patterns => {
    const body = document.getElementsByTagName('body')[0];
    const allHeadScripts = Array.from(document.querySelectorAll('head script'));
    const allBodyScripts = Array.from(document.querySelectorAll('body script'));
    const appendToBody = elements => {
      while (elements.length !== 0) {
        const ele = elements.shift();
        if (ele) {
          const node = ele;
          ele.remove();
          // 跳过已经插入过的
          if (window._useSSG && allBodyScripts.some(script => script.src === ele.src)) {
            continue;
          }
          body.appendChild(node);
        }
      }
    };
    const filtedScripts = allHeadScripts.filter(script => {
      return patterns.some(patternStr => script.src.includes(patternStr));
    });
    appendToBody(filtedScripts);
  }, patterns);
}

module.exports = moveBodyPreloadedResources;
