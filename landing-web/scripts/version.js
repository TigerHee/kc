/**
 * Produce version file to dist
 */
const fs = require('fs');
const path = require('path');
const { version, name } = require('../package.json');

const versionObj = {
  release: `${name}_${version}`,
  success: true,
  code: '200',
};

fs.writeFile(path.join(__dirname, '..', 'dist/version.json'), JSON.stringify(versionObj), () => {
  console.log('write version.json success !');
});
