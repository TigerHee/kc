/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2022-07-21 18:04:23
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-10-08 12:08:54
 * @FilePath: /g-biz/.offconfig.js
 * @Description:
 */
const path = require('path');
const fs = require('fs');
const _pwd = process.cwd();
const { version } = require(path.join(_pwd, './package.json'));
const zipWorkDir = `lib/`;
const projectName = 'g-biz';
const config = {
  //项目打包结果所在文件夹名称
  projectDistDirName: 'lib',
  zipWorkDir,
  //files=all [deprecated]
  packageName: projectName,
  //默认一个文件最大10M；超过大小请修改或者拆分文件
  maximumFileSizeToCacheInBytes: 10485760,
  //配置需要压缩的文件的正则，默认是全部文件
  globPatterns: ['**/*.js', '**/*.json'],
  onlyFullPkg: false, // false会打patch
  multiTenantSite:{
    turkey: {
      name: 'tr',
      sourceName: 'source_tr',
      appVersion: '1.0.0', // app最低支持版本
    },
    thailand: {
      name: 'th',
      sourceName: 'source_th',
      appVersion: '1.0.0', // app最低支持版本
    },
    global: {
      name: 'kc',
      sourceName: 'source',
      appVersion: '3.65.0', // app最低支持版本
    },
  },
  getCDNHost() {
    const cdnHost = 'https://assets.staticimg.com'; //线上环境域名

    return `${cdnHost}/${projectName}/${version}/`;
  },
  tailFunction() {
    try {
      const sourceDir = path.resolve(_pwd, `lib/source`);
      const manifestFilePath = path.resolve(_pwd, `lib/manifestEntries.json`);
      const targetDir = path.resolve(_pwd, `lib/${version}/source`);
      const manifestFileTargetDir = path.resolve(_pwd, `lib/${version}`);

      // 创建新的文件夹
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      // 创建新的文件夹
      if (!fs.existsSync(manifestFileTargetDir)) {
        fs.mkdirSync(manifestFileTargetDir, { recursive: true });
      }
      // 读取源文件夹中的所有文件
      const files = fs.readdirSync(sourceDir);

      // 遍历所有文件，找到.zip文件并移动
      for (let file of files) {
        if (path.extname(file) === '.zip') {
          const oldPath = path.join(sourceDir, file);
          const newPath = path.join(targetDir, file);

          fs.renameSync(oldPath, newPath);
          console.log(`Moved file ${file} old:${oldPath} new:${newPath}`);
        }
      }

      // 移动 manifestFilePath 文件

      const manifestNewPath = path.join(manifestFileTargetDir, path.basename(manifestFilePath));

      fs.renameSync(manifestFilePath, manifestNewPath);

      console.log(`Moved manifest file old:${manifestFilePath} new:${manifestNewPath}`);
      console.log('tailFunction mv success');
    } catch (e) {
      console.log('tailFunction mv error', e.message);
    }
  },
};

module.exports = config;
