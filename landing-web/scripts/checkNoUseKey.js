/**
 *  取出未使用的key,输出的文件包含了2种情况，就是key是拼接成的，那么就需要对输出的文件进行手动筛选
 *  另外一种就是最近添加的翻译，提交代码在2个月以内的，粗略判定为新提交代码，手动从结果中移除
 */
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const localeFile = path.join(cwd, './static/en_US.js'); //进行key对比的文件，默认为
const checkPath = path.join(cwd, './src');
const outputPath = path.join(cwd, './'); //输出到目录

const noUseList = [];
global.noUseList = noUseList;

// 遍历文件
const readFile = (path, key) => {
  let check = false;
  const localeFiles = fs.readdirSync(path);
  for (let j = 0; j < localeFiles.length; j++) {
    const localeFileName = localeFiles[j];
    //不需要进行处理的文件（.umi && locales && assets）
    if (localeFileName !== '.umi' && localeFileName !== 'locales' && localeFileName !== 'assets') {
      const pathNow = `${path}/${localeFileName}`;
      const stat = fs.lstatSync(pathNow);
      if (!stat.isDirectory()) {
        const res = fs.readFileSync(pathNow, 'utf-8');
        if (res.includes(key)) {
          // 查到了
          console.log('--文件--', pathNow, key);
          check = true;
          break;
        }
      } else {
        const state = readFile(pathNow, key);
        if (state) {
          check = true;
          break;
        }
      }
    }
  }
  return check;
};

// 读取文件内容
const result = fs.readFileSync(localeFile, { encoding: 'utf8' });
const resultFunc = new Function(result.replace('export default', 'return '));
const jsonResult = resultFunc();
if (jsonResult) {
  Object.keys(jsonResult).forEach(key => {
    const find = readFile(checkPath, key);
    if (!find) {
      noUseList.push(key);
    }
  });
}

// 输出key
fs.writeFile(`${outputPath}/.no_use_keys.json`, JSON.stringify(noUseList), 'utf-8', err => {
  if (err) {
    throw err;
  }
});
