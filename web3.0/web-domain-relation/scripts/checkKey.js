const fs = require('fs');
const path = require('path');
const { configPaths } = require('./config');

// stash save
global.window = {};

const checkDirs = configPaths;

checkDirs.forEach(sitesPath => {
  // clear
  window._WEB_RELATION_ = {};
  const stashFoos = [];

  // read
  const dirs = fs.readdirSync(sitesPath);
  dirs.forEach(filename => {
    const siteFile = path.resolve(sitesPath, filename);
    if (/\.js$/.test(siteFile)) {
      require(siteFile);
      stashFoos.push({
        siteFile,
        relation: window._WEB_RELATION_,
      });
    }
  });

  // compare
  const anchor = stashFoos[0];
  if (!anchor) {
    console.warn('Empty stash foos');
  }
  stashFoos.forEach(({ siteFile, relation }) => {
    const aS = anchor.siteFile;
    const aR = anchor.relation;
    const k0Arr = Object.keys(aR);
    const k1Arr = Object.keys(relation);

    if (k0Arr.length !== k1Arr.length) {
      console.error('Found keys size error', siteFile, aS);
      process.exit(1);
    }

    k1Arr.forEach(k => {
      if (!aR[k]) {
        console.error('Found keys value error', siteFile, aS);
        process.exit(1);
      }
    });
  });

});

console.log('CHECK ALL KEY SUCCESS!');
