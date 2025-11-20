const fs = require('fs');
const fse = require('fs-extra');

/**
 * 清空编译终止后遗留的临时文件（成功/失败）
 */
function prune() {
  const cwd = process.cwd();
  const configDir = `${cwd}/config/`;
  const srcDir = `${cwd}/src/`;
  const configContents = fs.readdirSync(configDir).filter(file => /MPA_/.test(file));
  const umiContents = fs.readdirSync(srcDir).filter(dir => /\.umi-production-([a-zA-Z0-9\-]+)/.test(dir));
  console.log(`Delete config files:
    ${configContents}
  `);
  console.log(`Delete .umi files:
    ${umiContents}
  `);
  if (configContents.length !== 0) {
    configContents.forEach(file => fse.removeSync(`${configDir}${file}`));
  }
  if (umiContents.length !== 0) {
    umiContents.forEach(dir => fse.removeSync(`${srcDir}${dir}`));
  }
}

prune();
