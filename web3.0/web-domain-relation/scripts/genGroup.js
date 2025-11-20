const fs = require('fs');
const path = require('path');
const  {configPaths ,tldConfig} = require('./config');

// stash save
global.window = {};

const rootPath = path.resolve(__dirname, '../sites');
const checkDirs = configPaths;
const sitesConfig = {};

checkDirs.forEach(sitesPath => {
  // clear
  window._WEB_RELATION_ = {};
  const stashFoos = [];

  // read
  const dirs = fs.readdirSync(sitesPath);
  dirs.forEach(filename => {
    const siteFile = path.resolve(sitesPath, filename);
    // 只注入开发或测试环境的，线上环境统一自动解析
    // 由于合约需要双线运行，合约的全部进入;
    if(!/futures|sandbox|sdb/.test(filename)) {
      return;
    }
    if (/\.js$/.test(siteFile)) {
      require(siteFile);
      stashFoos.push({
        siteFile,
        relation: window._WEB_RELATION_,
      });
    }
  });

  // compare
  stashFoos.forEach(({ siteFile, relation }) => {
    const k = siteFile
      .replace(`${rootPath}/`, '')
      .replace(/\.js$/, '');
    // console.log(k);
    sitesConfig[k] = relation;
  });

});

/*
www.kucoin.top.js
www.kucoin.com.js
www.kucoin.io.js
dev/fast-coin-web.js
dev/hybrid-h5.js
dev/trade-web.js
futures/futures.kucoin.io.js
futures/dev/kumex-web.js
 */
const content = `
// this file is generate by genGroup for rollup
// don't edit this file
export const _TLD__CN_ = "${tldConfig.tldCN}";
export default ${JSON.stringify(sitesConfig)};
`;

fs.writeFileSync(path.resolve(__dirname, '../src/group.js'), content, {
  flag: 'w',
});

console.log('Gen Group SUCCESS!');
