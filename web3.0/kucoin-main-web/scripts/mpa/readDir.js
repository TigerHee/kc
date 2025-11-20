const { lstatSync, readFileSync, readdirSync } = require('fs');
const { join } = require('path');
const { isReactComponent } = require('@umijs/ast');
function readDirPages(sourceDir) {
  try {
    return readdirSync(sourceDir).filter((file) => {
      const absFile = join(sourceDir, file);
      if (
        lstatSync(absFile).isDirectory() &&
        ['components', 'component', 'utils', 'util'].includes(file)
      ) {
        return false;
      }
      if (file.indexOf('.ejs') > -1) {
        return false;
      }
      if (file.charAt(0) === '.') return false;
      if (file.charAt(0) === '_' && !['_layout.js', '_layout.tsx'].includes(file)) return false;
      // exclude test file
      if (/(test|spec|e2e)\.(j|t)(sx|s)?$/.test(file)) return false;
      // d.ts
      if (/\.d\.ts$/.test(file)) return false;
      if (lstatSync(absFile).isFile()) {
        if (/(404)\.(j|t)(sx|s)?$/.test(file)) {
          return false;
        }
        if (!/(j|t)(sx|s)?$/.test(file)) return false;
        const content = readFileSync(absFile, 'utf-8');
        try {
          if (!isReactComponent(content)) return false;
        } catch (e) {
          throw new Error(`Parse conventional route component ${absFile} failed, ${e.message}`);
        }
      }
      return true;
    });
  } catch (err) {
    console.error(err);
  }
}
module.exports = {
  readDirPages,
};
