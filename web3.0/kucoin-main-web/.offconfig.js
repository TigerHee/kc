const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;
const pkg = require('./package.json');

const cwd = process.cwd();
const zipWorkDir = `dist/${pkg.name}/${pkg.version}`;

const config = {
  //项目打包结果所在文件夹名称
  projectDistDirName: 'dist',
  versionFileName: 'version.json',
  // 打压缩包、匹配文件实际工作的目录
  zipWorkDir,
  //files=all [deprecated]
  // packageName: "test",
  //默认一个文件最大10M；超过大小请修改或者拆分文件
  maximumFileSizeToCacheInBytes: 10485760,
  //配置需要压缩的文件的正则
  // globPatterns: ["**/umi.*", "**/uis.*", "**/locales.*"],
  // globPatterns: ['**/*.js', '**/*.css', '**/*.html', '**/*.svg', '**/*.jpg'],
  globPatterns: [
    // 业务内容:合伙人、邀请有礼
    '**/affiliate/*.js',
    '**/affiliate/*.css',
    '**/referral/*.js',
    '**/referral/*.css',
  ],
  // 是否只打全量包
  onlyFullPkg: false, // false会打patch
  // landing-web、kucoin-h5 等项目的可参考配置方式，默认
  getCDNHost() {
    const _pwd = process.cwd();
    const { name: projectName, version } = require(path.join(_pwd, './package.json'));
    const projectAliasName = config.packageName || projectName;
    let cdnHost = 'https://assets.staticimg.com';
    return `${cdnHost}/${projectAliasName}/${version}/`;
  },
  tailFunction() {
    try {
      execSync(`mkdir -p ${path.resolve(cwd, `dist/main/source`)}`);
      execSync(
        `mv ${path.resolve(cwd, `dist/source/source.json`)} ${path.resolve(
          cwd,
          `dist/main/source`,
        )}`,
      );
      // 移动 ./dist/source 到./dist/项目名/版本号/source
      execSync(
        `mv ${path.resolve(cwd, `dist/source`)} ${path.resolve(
          cwd,
          `dist/${pkg.name}/${pkg.version}`,
        )}`,
      );
      console.log('tailFunction mv success');
    } catch (e) {
      console.log('tailFunction mv error', e.message);
    }
  },
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
};

module.exports = config;
