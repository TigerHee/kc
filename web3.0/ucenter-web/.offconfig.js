/**
 * Owner: tiger@kupotech.com
 */
const path = require('path');
const fs = require('fs');
const _pwd = process.cwd();
const { name: projectName, version } = require(path.join(_pwd, './package.json'));
const zipWorkDir = `dist/${projectName}/${version}`; //这里需要注意，3.0 架构路径必须要配置
// 名字和packageName不同
const CICDName = projectName;
const config = {
  //项目打包结果所在文件夹名称
  projectDistDirName: 'dist',
  zipWorkDir,
  //files=all [deprecated]
  packageName: CICDName,
  //默认一个文件最大10M；超过大小请修改或者拆分文件
  maximumFileSizeToCacheInBytes: 10485760,
  //配置需要压缩的文件的正则，默认是全部文件
  globPatterns: [
    // 通用
    '**/*.html',
    '**/*.css',
    '**/*.woff',
    '**/*.woff2',
    '**/*.js',
  ],
  onlyFullPkg: false, // false会打patch
  multiTenantSite: {
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
  // landing-web、kucoin-h5 等项目的可参考配置方式，默认
  getCDNHost() {
    const cdnHost = 'https://assets.staticimg.com'; //线上环境域名
    return `${cdnHost}/${CICDName}/${version}/`;
  },
  getProductionCDN() {
    return (cdnHost = 'https://assets.staticimg.com'); //线上环境域名
  },
  getSourceJsonPath() {
    return `https://www.kucoin.com/${CICDName}/source/source.json`;
  },
  tailFunction() {
    try {
      const sourceDir = path.resolve(_pwd, `dist/source`);
      const targetDir = path.resolve(_pwd, `dist/${projectName}/${version}/source`);

      // 创建新的文件夹
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
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
      console.log('tailFunction mv success');
    } catch (e) {
      console.log('tailFunction mv error', e.message);
    }
  },
};

// app通过以下配置信息来获取到离线版本号和离线包
// https://helper.staticimg.co/_configs

module.exports = config;
