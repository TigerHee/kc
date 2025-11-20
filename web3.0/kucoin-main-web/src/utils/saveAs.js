/**
 * Owner: willen@kupotech.com
 */
/**
 * Save As
 * runtime: browser
 * @param {*} uri
 * @param {*} filename
 */
// from http://stackoverflow.com/questions/283956/
const saveAs = (uri, filename) => {
  // 新增：检测 PDF 链接（支持带查询参数和大小写）
  const isPDF = /\.pdf($|\?)/i.test(uri);
  const link = document.createElement('a');
  // PDF 文件在新标签页打开
  if (typeof link.download === 'string' && !isPDF) {
    document.body.appendChild(link);
    link.download = filename;
    link.href = uri;
    link.click();
    document.body.removeChild(link);
  } else {
    window.open(uri);
  }
};

export default saveAs;
