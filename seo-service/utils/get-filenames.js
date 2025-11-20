/**
 * 读取目录下 .js 文件名
 * Owner: hanx.wei@kupotech.com
 */
const fse = require('fs-extra');

exports.getDirFilenames = (dir, filterFn) => {
  return fse.readdirSync(dir).filter(file => {
    if (/\.js/.test(file)) {
      return filterFn(file);
    }
    return false;
  });
};
