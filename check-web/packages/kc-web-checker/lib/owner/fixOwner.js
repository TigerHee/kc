var fs = require('fs');
const { exec, emailReg } = require('../utils');
const { getConfig } = require('./config');

function _insertToFile(file, owner) {
  const content = fs.readFileSync(file, 'utf-8');
  const newContent = `/**
 * Owner: ${owner}
 */
${content}`;
  fs.writeFileSync(file, newContent, 'utf-8');
}

module.exports = async (owner, { diff: useDiff }) => {
  // find ./src -type f -name "*.js" | egrep -v "(config|limiter|lru)"
  // 仅校验src/ 下的js 文件
  const _config = getConfig();
  
   // 生成name 配置，以便支持多种文件类型
  const filterByName =  _config.name.map(v => {
    return '-name ' + `"${v}"`;
  }).join(" -o ");

  let _cmdLine = `find ${_config.src} -type ${_config.type} ${filterByName} | egrep -v "(${_config.exclude.join('|')})"`;
  if(useDiff) {
      _cmdLine = `git diff --diff-filter=d  --name-only master ${_config.src} | grep -E ".(j|t)s(x)?$" | egrep -v "(${_config.exclude.join('|')})"`;
  }

  const { data: filesStr } = await exec(_cmdLine);

  const files = filesStr.split('\n').filter(v => !!v).map(v => {
    return /^\.\//.test(v) ? v : './'+v;
  });

  for (let file of files) {
    if (!file) continue;
    try {
      const _file_encoded =file.replace(/\$/g, '\\$').replace(/(\[|\])/g, '\\$1');
      const { data: result } = await exec(`cat ${_file_encoded} | grep -E -i "owner\:${emailReg}"`)
      if (!result) {
        _insertToFile(file, owner);
      }
    } catch (e) {
      console.log('err', e);
    }
  }
}
