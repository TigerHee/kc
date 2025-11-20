
const path = require('path');
/**
 * 配置目录
 */
exports.configPaths = [
  path.resolve(__dirname, '../sites'),
  path.resolve(__dirname, '../sites/dev'),
  path.resolve(__dirname, '../sites/futures'),
  path.resolve(__dirname, '../sites/futures/dev'),
];

exports.tldConfig  = {
  tldCN: 'center'
}
