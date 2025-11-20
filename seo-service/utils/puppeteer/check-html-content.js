/**
 * Owner: hanx.wei@kupotech.com
 */
// 检查 html 文本内容
function checkHTMLContent(content) {
  // 起始和闭合
  if (
    !content.startsWith('<!DOCTYPE html><html') ||
    !content.endsWith('</body></html>')
  ) {
    return false;
  }
  return true;
}

module.exports = checkHTMLContent;
