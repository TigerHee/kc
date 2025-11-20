/**
 * 计算生成文件全路径
 * Owner: hanx.wei@kupotech.com
 */
const url = require('url');
const path = require('path');

module.exports = (currentUrl, task, projectConfig, isMobile = false) => {
  // 避免 extname
  const urlPathname = url.parse(currentUrl).pathname;
  const parsedUrlPath = path.parse(urlPathname);
  const distPath = task.isApp
    ? projectConfig.distConfig[task.theme].projectAppTempDistPath
    : isMobile
      ? projectConfig.distConfig[task.theme].projectMobileTempDistPath
      : projectConfig.distConfig[task.theme].projectTempDistPath;
  // 这里把英语也单独写一个目录，方便按语言整体拷贝内容
  if (task.lang === 'en') {
    const writeFilePath = path.join(distPath, task.lang, task.taskId, parsedUrlPath.dir, parsedUrlPath.name);
    const writeFileName = path.join(writeFilePath, 'index.html');
    return writeFileName;
  }
  if (parsedUrlPath.dir === '/') {
    // 语言首页 /de /ko 这类
    const writeFilePath = path.join(distPath, parsedUrlPath.dir, parsedUrlPath.name, task.taskId);
    const writeFileName = path.join(writeFilePath, 'index.html');
    return writeFileName;
  }
  const dirPath = path.join(distPath, parsedUrlPath.dir, parsedUrlPath.name);
  const writeFilePath = dirPath.replace(`/${task.lang}/`, `/${task.lang}/${task.taskId}/`);
  const writeFileName = path.join(writeFilePath, 'index.html');
  return writeFileName;
};
