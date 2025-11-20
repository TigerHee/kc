/**
 * 自动加载目录下的项目配置导出
 * Owner: hanx.wei@kupotech.com
 */
const { getDirFilenames } = require('@utils/get-filenames');
const configFiles = getDirFilenames(__dirname, file => file !== 'index.js');

const projectConfigs = {};
configFiles.forEach(file => {
  const config = require(`./${file}`);
  projectConfigs[config.projectName] = config;
});

module.exports = projectConfigs;
