/**
 * Owner: simple@kupotech.com
 */
const fs = require('fs');
const csv = require('fast-csv');
const xlsx = require('node-xlsx');
const path = require('path');
const promisify = require('util').promisify;

const fsAccess = promisify(fs.access);
const fsReadFile = promisify(fs.readFile);
const syntaxReplace = '{_SYNTAX_LOCALE_CONTENT_}';

/**
 * @name getJsFunction
 * @description 语言包的处理函数
 * @param {string} data
 * @param {string|function} syntax
 */
const getJsFunction = (data, syntax) => {
  let jsSyntax = data;

  if (typeof syntax === 'string') {
    if (syntax.indexOf(syntaxReplace) > -1) {
      jsSyntax = syntax.replace(syntaxReplace, () => data);
    } else {
      jsSyntax = syntax + data;
    }
  }

  if (typeof syntax === 'function') {
    jsSyntax = syntax(data);
  }

  return new Function(jsSyntax);
};

const extractDiff = (src, dist) => {
  const temp = {};

  Object.keys(src).forEach((key) => {
    if (typeof dist[key] === 'undefined') {
      temp[key] = src[key];
    }
  });

  return temp;
};

const addLocaleKey = (o, pathname) => {
  const lcoaleKey = path.basename(pathname, path.extname(pathname));

  return {
    __locale__: lcoaleKey,
    ...o,
  };
};

const csvFormat = (keys, locales, { pathname }) => {
  const rows = [['key', ...locales.map(({ __locale__ }) => __locale__)]];

  keys
    .filter((key) => key !== '__locale__')
    .forEach((key) => {
      const row = [key];
      locales.forEach((o) => {
        row.push(o[key] || '');
      });

      rows.push(row);
    });

  csv.writeToPath(pathname, rows, { writeBOM: true });
};

const xlsxFormat = (keys, locales, { pathname }) => {
  const rows = [['key', ...locales.map(({ __locale__ }) => __locale__)]];

  keys
    .filter((key) => key !== '__locale__')
    .forEach((key) => {
      const row = [key];
      locales.forEach((o) => {
        row.push(o[key] || '');
      });

      rows.push(row);
    });

  const myData = [{
    name: 'data',
    data: rows,
  }];
  // 构建数据流，写入excel
  const buffer = xlsx.build(myData);
  fs.writeFile(pathname, buffer, err => {
    if (err) {
      throw err;
    }
  });
};

// 删除文件
const deleteOneFile = (path) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}
// 删除文件夹
function deleteFiles(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      const curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteFiles(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

function timeTwoLen(str) {
  if (!str) {
    return '';
  }
  const _str = str.toString();
  if (_str.length < 2) {
    return `0${_str}`;
  }
  return _str;
}

function getNowTimeFormat() {
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();
  return `${year}${timeTwoLen(month)}${timeTwoLen(day)}${timeTwoLen(hour)}${timeTwoLen(minute)}${timeTwoLen(second)}`;
}

module.exports = {
  getJsFunction,
  extractDiff,
  addLocaleKey,
  csvFormat,
  xlsxFormat,
  fsAccess,
  fsReadFile,
  deleteOneFile,
  deleteFiles,
  getNowTimeFormat,
};
