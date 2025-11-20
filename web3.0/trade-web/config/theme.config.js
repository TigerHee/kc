/**
 * Owner: garuda@kupotech.com
 * 用来处理 less 中定义的变量声明
 */

const fs = require('fs');
const path = require('path');
const lessToJs = require('less-vars-to-js');

module.exports = () => {
  const themePath = path.join(__dirname, '../src/themes/vars.less');
  return lessToJs(fs.readFileSync(themePath, 'utf8'));
};

