const path = require('path');
const fs = require('fs');
const pkg = require('../package.json');
const cwd = process.cwd();

// 生成version.json
function generateVersion() {
  const versionObj = {
    release: `${pkg.name}_${pkg.version}`,
  };

  fs.writeFile(path.resolve(cwd, 'dist/version.json'), JSON.stringify(versionObj), () => {
    console.log('write version.json success !');
  });
}

generateVersion();
