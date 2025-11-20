/**
 * Owner: victor.ren@kupotech.com
 */
const fs = require('fs');
const path = require('path');
const { cwd } = require('process');

async function main() {
  fs.readdirSync('lib').forEach((file) => {
    if (file.indexOf('index') < 0 && file.indexOf('node') < 0) {
      const packageJson = {
        sideEffects: 'false',
        module: './index.js',
        main: `../node/${file}/index.js`,
        types: './index.d.ts',
      };
      const libPkgPath = path.join(path.join(cwd(), `lib/${file}/package.json`));
      fs.writeFileSync(libPkgPath, JSON.stringify(packageJson, null, 2), 'utf-8');
    }
  });
}
main();
