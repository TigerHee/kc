/**
 * Owner: victor.ren@kupotech.com
 */
/**
 * 此脚本用于遍历src目录下所有的d.ts文件，并拷贝至对应的发布目录中，用于开发时的类型提示
 */
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

// lib目录是否存在
const isBuildSrcExists = fs.existsSync(path.resolve('./lib'));

// 组件文件的目录
const BASE_PATH = './src';
// 发布的commonjs目录
const PUBLISH_PATH = './lib';
// 发布的es目录
const PUBLISH_PATH_2 = './lib/node';

const componentsPathRegExp = /^components\//;

/**
 *
 * @param {string} relativePath 读取的相对路径
 * @param {string[]} publishBasePaths 发布目录数组
 */
function copyDtsFiles(relativePath, publishPaths = []) {
  // 读取该目录下有哪些文件夹与文件
  const files = fs.readdirSync(path.resolve(BASE_PATH, relativePath));
  // 编辑目录下的文件数组
  _.forEach(files, (file) => {
    // 相对地址
    const nextPath = path.join(relativePath, file);
    // 绝对地址
    const nextAbsolutePath = path.resolve(BASE_PATH, nextPath);
    // 获取文件或文件夹的信息
    const stat = fs.statSync(nextAbsolutePath);
    // 如果是目录，则继续遍历
    if (stat.isDirectory()) {
      copyDtsFiles(nextPath, getPublishPaths(nextPath));
    } else {
      // 如果是文件，则判断是否为d.ts文件
      const isDts = /d.ts$/.test(file);
      const isRootIndexFile = nextAbsolutePath.indexOf('src/index.js') >= 0;
      // 如果是dts，则拷贝该文件至发布目录对应的目录结构下
      if (isDts || isRootIndexFile) {
        if (isRootIndexFile) {
          let data = fs.readFileSync(nextAbsolutePath, { encoding: 'utf-8' });
          data = data.replace(/'(?!components\/)(.*)'/g, `'./$1'`);
          data = data.replace(/'components\/(.*)'/g, `'./$1'`);
          _.forEach(publishPaths, (p) => {
            const newFile = file.replace(/\.js$/, '.d.ts');
            fs.copyFileSync(nextAbsolutePath, path.resolve(p, newFile));
            fs.writeFileSync(path.resolve(p, newFile), data);
          });
        } else {
          _.forEach(publishPaths, (p) => {
            fs.copyFileSync(nextAbsolutePath, path.resolve(p, file));
          });
        }
        console.log(`Copy d.ts file: ${nextPath}`);
      }
    }
  });
}

// 获取的发布目录对应的dts路径
function getPublishPaths(nextPath) {
  const isInComponents = componentsPathRegExp.test(nextPath);
  return [
    path.join(PUBLISH_PATH, isInComponents ? nextPath.replace(componentsPathRegExp, '') : nextPath),
    path.join(
      PUBLISH_PATH_2,
      isInComponents ? nextPath.replace(componentsPathRegExp, '') : nextPath,
    ),
  ];
}

if (isBuildSrcExists) {
  copyDtsFiles('.', getPublishPaths('.'));
}
