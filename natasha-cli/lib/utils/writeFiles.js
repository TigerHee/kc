const path = require('path');
const fs = require('fs-extra');

module.exports = async function writeFiles (dir, files) {
  Object.keys(files).forEach(name => {
    const filePath = path.join(dir, name);
    fs.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, files[name]);
  });
};
