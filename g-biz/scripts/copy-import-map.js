// build 的时候生成 gbiz-import-map.json
const fs = require('fs');

/**
 * 复制并修改文件内容 *
 * @param {string} srcPath 源文件路径
 * @param {string} destPath 目标文件路径
 * @param {function} modifyContentCallback 修改内容的回调函数
 * @returns {Promise<void>}
 */
async function copyAndModifyFile(srcPath, destPath, modifyContentCallback) {
  return new Promise((resolve, reject) => {
    fs.readFile(srcPath, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
        return;
      }
      const modifiedContent = modifyContentCallback(data);
      fs.writeFile(destPath, modifiedContent, 'utf8', (writeErr) => {
        if (writeErr) {
          reject(writeErr);
          return;
        }
        resolve();
      });
    });
  });
}

copyAndModifyFile('lib/gbiz-import-map.json', 'lib/gbiz-import-map.sit.json', (data) => {
  return data.replace(/https:\/\/assets.staticimg.com/gm, 'https://assets-v2.kucoin.net');
});
