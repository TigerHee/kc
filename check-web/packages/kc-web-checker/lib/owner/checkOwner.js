//  检查所有文件，看是否有owner 设置
const { log, exec, emailReg, genInfoHTML } = require('../utils');
const { getConfig } = require('./config');
async function _check(_files) {
  const testFailedFiles = [];
  for (let _file of _files) {
    if (!_file) continue;
    try {
      const _file_encoded = _file
        .replace(/\$/g, '\\$')
        .replace(/(\[|\])/g, '\\$1');
      const { data: result } = await exec(
        `cat ${_file_encoded} | grep -E -i "owner\:${emailReg}"`
      );
      // console.log(emailReg)
      // console.log('checked file:', _file, ":", result ? 'ok' : 'failed');
      if (!result) {
        testFailedFiles.push(_file);
      }
    } catch (e) {
      console.log('err', e);
    }
  }
  return testFailedFiles;
}

async function main(options = { diff: false }) {
  // 仅校验src/ 下的js 文件
  const _config = getConfig();

  console.log('config', _config);

  // 生成name 配置，以便支持多种文件类型
  const filterByName = _config.name
    .map((v) => {
      return '-name ' + `"${v}"`;
    })
    .join(' -o ');

  let _cmdLine = `find ${_config.src} -type ${
    _config.type
  } ${filterByName} | egrep -v "(${_config.exclude.join('|')})"`;

  if (options.diff) {
    _cmdLine = `git diff --diff-filter=d  --name-only master ${
      _config.src
    } | grep -E "\\.(j|t)s(x)?$" | egrep -v "(${_config.exclude.join('|')})"`;
  }
  const { data: filesStr } = await exec(_cmdLine);

  const files = filesStr
    .split('\n')
    .filter((v) => !!v)
    .map((v) => {
      return /^\.\//.test(v) ? v : './' + v;
    });

  const checkProcess = [];
  // 任务拆分
  while (files.length) {
    checkProcess.push(_check(files.splice(0, 500)));
  }

  const results = await Promise.all(checkProcess)
    .then(async (res) => {
      // 数组拍平 flat
      const targetFiles = res.reduce((pre, cur) => pre.concat(cur), []);
      if (targetFiles.length > 0) {
        log.red('[Info] Owner check failed:\n');
        log.info(targetFiles.join('\n'));
        // await reportWithBuildInfo('Owner Check failed', `<ul><li>${targetFiles.join('</li></li>')}</li></ul>`);
        // process.exit(1);
        return {
          code: 1,
          msg: genInfoHTML(
            'owner',
            'FAIL',
            `<div><ul><li>${targetFiles.join('</li></li>')}</li></ul></div>`
          ),
          extraData: targetFiles,
          // msg: `owner: FAIL<div><ul><li>${targetFiles.join('</li></li>')}</li></ul></div>`
        };
      } else {
        // await reportWithBuildInfo('Owner Check success');
        // log.info('[Info] Owner check success\n');
        // process.exit(0);
        return {
          code: 0,
          msg: genInfoHTML('owner', 'PASS'),
        };
      }
    })
    .catch((e) => {
      console.log('[Error] Owner check Error:', e);
      const err = `(${e.message || 'some error happend'})`;
      return {
        code: 2,
        msg: genInfoHTML('owner', 'FAIL', err),
      };
    });
  return results;
}

module.exports = main;
