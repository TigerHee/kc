/**
 * Owner: victor.ren@kupotech.com
 */
/* eslint-disable no-inner-declarations */
const fs = require('fs');
const path = require('path');

function resolvePath(filePath, str, to, replace) {
  let inputFile = fs.readFileSync(filePath, 'utf8');
  if (replace) {
    inputFile = replace(inputFile);
  } else {
    inputFile = inputFile.replace(str, to);
  }
  fs.writeFileSync(filePath, inputFile, 'utf8');
}

function deepResolveComponentsPath(dirPath, needPromote, unNecessaryDir, unNecessaryFile) {
  const dirInfo = fs.readdirSync(dirPath);
  dirInfo.forEach((item) => {
    const location = path.join(dirPath, item);
    const info = fs.statSync(location);
    if (info.isDirectory()) {
      const res = unNecessaryDir.some((item) => location.includes(item));
      if (res) return;
      deepResolveComponentsPath(location, needPromote, unNecessaryDir, unNecessaryFile);
    } else {
      function resolvePromote(inputFile) {
        const hasUnNecessary = unNecessaryFile.some((item) => location.includes(item));
        if (hasUnNecessary) {
          return inputFile;
        }
        let _inputFile = inputFile;
        needPromote.forEach((item) => {
          _inputFile = _inputFile.replace(new RegExp(`\.\.\/${item}`, 'g'), item);
        });
        return _inputFile;
      }
      resolvePath(location, '', '', resolvePromote);
    }
  });
}

// 处理 ./components -> ./
const relativePathNeedResolve = ['lib/index.js', 'lib/node/index.js'];

function resolveRelativePath() {
  relativePathNeedResolve.forEach((file) => {
    const filePath = path.resolve(__dirname, '../', file);
    resolvePath(filePath, /\/components/g, '');
    console.log(`resolved path ${file}: ./components -> ./`);
  });
}

// 打包后，组件库里面这些路径需要提升一级
const componentsUtilsDirNeedResolve = [
  'components',
];
// 排除需要提升的目录和文件
const componentsUtilsDirUnnecessaryResolve = [];
const componentsUtilsFileUnnecessaryResolve = ['lib/index.js', 'lib/node/index.js'];

function resolveComponentsUtilsPath() {
  const dirPath = path.resolve(__dirname, '../', 'lib');
  deepResolveComponentsPath(
    dirPath,
    componentsUtilsDirNeedResolve,
    componentsUtilsDirUnnecessaryResolve,
    componentsUtilsFileUnnecessaryResolve,
  );
  console.log(
    `resolved dir ${componentsUtilsDirUnnecessaryResolve.toString()}; eg: ../utils -> utils`,
  );
}

resolveRelativePath();
resolveComponentsUtilsPath();
