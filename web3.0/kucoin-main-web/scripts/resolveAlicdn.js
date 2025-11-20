const fs = require('fs');
const path = require('path');

const execCmd = require('child_process').exec;

const { version, name } = require('../package.json');

const cdnPath = `${name}/${version}/`;
const UMI_ENV = (process.env.npm_lifecycle_event || '').split(':')[1] || '';

const distDir = path.join(__dirname, '../dist', cdnPath);

const IS_INSIDE_WEB = UMI_ENV === 'cn';
const IS_TEST_ENV = UMI_ENV === 'sit';
const IS_SANDBOX = UMI_ENV === 'sdb';
const IS_DEV = process.env.NODE_ENV === 'development';
const NOT_PROD = IS_DEV || IS_TEST_ENV || IS_SANDBOX;
const cdnHost = 'https://assets.staticimg.com';

const publicPath = `${cdnHost}/${cdnPath}`;

console.log(publicPath);

async function exec(cmdLine) {
  return new Promise((resolve) => {
    execCmd(cmdLine, (err, stdout) => {
      resolve({
        error: err,
        data: stdout,
      });
    });
  });
}

async function getAllCssPaths() {
  const { error, data } = await exec(`find ${distDir} | xargs ls -d | grep ".css"`);
  if (!error) {
    const csss = data.split('\n');
    return csss.filter((v) => v.indexOf('charting_library_1.14') === -1);
  }
  console.log(error);
}

async function writeFile(filePath, content) {
  return new Promise((resolve) => {
    fs.writeFile(filePath, content, { encoding: 'utf-8' }, (err) => {
      resolve({
        error: err,
      });
    });
  });
}

async function readFile(filePath) {
  return new Promise((resolve) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      resolve({
        error: err,
        data,
      });
    });
  });
}

async function modFile(filePath) {
  const { error, data } = await readFile(filePath);
  // const csss = data.split('\n');
  if (!error) {
    const _data = data.replace(
      /https:\/\/at\.alicdn\.com\/t\/font_148784_v4ggb6wrjmkotj4i/g,
      `${publicPath}static/ali-font/font_148784_v4ggb6wrjmkotj4i`,
    );
    await writeFile(filePath, _data);
  } else {
    console.log(error);
  }
}

async function resolveAliCdn(cssFiles) {
  const [cur, ...rest] = cssFiles;

  await modFile(cur);
  if (rest.length && rest[0]) {
    resolveAliCdn(rest);
  }
}

async function main() {
  const cssFiles = await getAllCssPaths();
  await resolveAliCdn(cssFiles);
}

module.exports = main;
