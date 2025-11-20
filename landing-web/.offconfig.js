const path = require('path');

const config = {
  //项目打包结果所在文件夹名称
  projectDistDirName: 'dist',
  //files=all [deprecated]
  // packageName: "test",
  //默认一个文件最大10M；超过大小请修改或者拆分文件
  maximumFileSizeToCacheInBytes: 10485760,
  // offline-sources@1.0.15版本更新: 对增量包合全量包添加 maxZipSize参数，默认：1024 * 1024 * 8, 8MB可通过.offconfig.js 配置修改
  maxZipSize: 10485760, // 加入2024年度账单持续时间大概2周，临时增加到10mb, 活动结束删掉即可
  //配置需要压缩的文件的正则，默认是全部文件
  globPatterns: [
    // 通用
    '**/*.html',
    '**/*.css',
    '**/umi*.js',
    '**/locales/*.js',
    '**/langLoader.js',
    '**/routerBase.*',
    '**/anomaly.min.js',
    '**/vendor*.async.js',
    '**/async-commons*.async.js',
    '**/chunk-kcreport*.async.js',
    '**/chunk-kctdk*.async.js',
    '**/chunk-kc-socket*.async.js',
    '**/kcsources*',
    '**/layouts.*',
    '**/layout*.js',
    '**/layouts__index.*.js',
    '**/2.async.js',
    '**/3.async.js',
    '**/7.async.js',
    '**/6.async.js',
    '**/8.async.js',
    '**/9.async.js',
    '**/10.async.js',
    '**/14.async.js',
    '**/12.async.js',
    '**/17.async.js',
    '**/18.async.js',
    '**/19.async.js',
    '**/23.async.js',
    '**/24.async.js',
    '**/25.async.js',
    '**/31.async.js',
    '**/43.async.js',
    '**/81.async.js',
    '**/115.async.js',
    '**/116.async.js',
    '**/118.async.js',
    '**/119.async.js',
    '**/*spotlight*.async.js',
    '**/*.woff',
    '**/*.woff2',
    '**/p__promotions*.async.js',
    '**/*community-collect*.async.js',
    '**/p__activity*.async.js',
    '**/[0-9]{1,5}.async.js',
    // 2024年度账单 活动结束后续删掉 持续时间大概2周 start
    '**/p__2024-annual-report*.async.js'
    // 2024年度账单 活动结束后续删掉 持续时间大概2周 end
  ],
  // 是否只打全量包
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
    const _pwd = process.cwd();
    // const { site } = require(path.join(_pwd, 'site-config.json'));
    const { name: projectName, version } = require(path.join(_pwd, './package.json'));
    const projectAliasName = config.packageName || projectName;
    let cdnHost = 'https://assets.staticimg.com';
    return `${cdnHost}/${projectAliasName}/${version}/`;
  },
};

module.exports = config;
