const { exec } = require('../utils');
const { getConfig } = require('./config');

const config = getConfig();
const _config = Object.assign({}, config);
// 查询所有的文件
async function getAllFiles(fileType) {
  const filterByName = _config[fileType]
    .split('|')
    .map((v) => {
      return '-name ' + `"${v}"`;
    })
    .join(' -o ');

  let _cmdLine = `find ${_config.src} -type ${_config.type} ${filterByName} | wc -l;`;
  const files = await exec(_cmdLine);
  return parseInt(files?.data?.trim(), 10);
}

async function main() {
  try {
    console.log('config', _config);
    const ts_count = await getAllFiles('ts');
    const js_count = await getAllFiles('js');
    const all_count = ts_count + js_count;

    return {
      all_count,
      ts_count,
      js_count,
    };
  } catch (error) {
    console.error('ts Error:', error.message);
  }
}

module.exports = main;
