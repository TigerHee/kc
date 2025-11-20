const fs = require('fs');
const path = require('path');

function logRed(message) {
  console.log('\x1b[31m' + message + '\x1b[0m');
}

function logGreen(message) {
  console.log('\x1b[32m' + message + '\x1b[0m');
}

function logYellow(message) {
  console.log('\x1b[33m' + message + '\x1b[0m');
}
const localesPath = '/cdnAssets/static/locales';
const targetDir = path.join(__dirname, `..${localesPath}`);

// 要删除的 key 列表，提交 git前删除数组内的 key
const toDeleteKeys = [];

if (!fs.existsSync(targetDir)) {
  logRed(`目录: ${targetDir} 不存在`);
  process.exit(1);
}

function varyImportantLog() {
  logYellow(`
!!!!!!!!!!!
  请注意:
  本删除脚本并未确认 src 目录下代码中是否使用该 key，
  仅删除${localesPath}中指定的 key-value 对
  需要手动确认 src 目录下代码中是否使用该 key
!!!!!!!!!!!
  `);
}

function deleteDeprecatedKeys() {
  const files = fs.readdirSync(targetDir);
  for (const file of files) {
    console.log('\n');
    logGreen(`开始处理文件: ${file}`);
    const lgFilePath = path.join(targetDir, file);
    const fileContent = fs.readFileSync(lgFilePath, 'utf8');

    for (const keyToDelete of toDeleteKeys) {
      const regex = new RegExp(`[\u0020]*"${keyToDelete}":\\s?".*",?\\s?`, 'g');
      const match = fileContent.match(regex);

      if (match?.[0]) {
        logGreen(`找到key: ${keyToDelete}`);
        // 删除匹配到的内容
        const newContent = fileContent.replace(regex, '');

        // 写回修改后的内容到文件
        fs.writeFileSync(lgFilePath, newContent);
        logGreen(`已删除key：${keyToDelete}`);
      } else {
        logRed(`${file}中不存在key："${keyToDelete}"`);
      }
    }
    logGreen(`${file} 已处理完成`);
  }
}

varyImportantLog();

deleteDeprecatedKeys();

varyImportantLog();
