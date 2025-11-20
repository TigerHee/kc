// 根据 neeko diff json 来清理本地的语言文件
const path = require('path');
const fs = require('fs');

const WORKDIR = process.cwd();
const localeFilesPath = `${WORKDIR}/cdnAssets/static/locales`;
const diffFilePath = `${WORKDIR}/.neeko/diff.json`;

// 确定要删除的 key
const ensureRemovedKeys = ['login', 'search'];

function start() {
  try {
    const res = fs.statSync(diffFilePath);
  } catch {
    console.log('no neeko diff file');
    return;
  }
  const diff = require(diffFilePath);
  const files = fs.readdirSync(localeFilesPath);

  const removedKeys = [
    ...diff.localeOnly,
    ...ensureRemovedKeys,
  ];

  for (const file of files) {
    const newLines = [];
    const data = fs.readFileSync(`${localeFilesPath}/${file}`, 'UTF-8');
    const lines = data.split(/\r?\n/);
    lines.forEach(line => {
      for (const key of removedKeys) {
        if (line.indexOf(key) === 3) return;
      }
      if (line) {
        newLines.push(line);
      }
    });
    for (const newLine of newLines) {
      fs.writeFileSync(`${localeFilesPath}/${file}.new`, `${newLine}\n`, { flag: 'a' });
    }
    fs.unlinkSync(`${localeFilesPath}/${file}`);
    fs.renameSync(`${localeFilesPath}/${file}.new`, `${localeFilesPath}/${file}`)
  }
}

start();
