const pkg = require('../package.json');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const fse = require('fs-extra');
const cpuCount = require('os').cpus().length;

const { readDirPages } = require('./mpa/readDir');
const { handleRouteTemplate } = require('./mpa/routeTemplate');
// const { cnMetas } = require('../config/metas.js');

const srcDir = path.resolve(__dirname, '../src');
const pagesDir = `${srcDir}/pages`;
const configDir = path.resolve(__dirname, '../config');
const packageVersion = `${pkg.name}/${pkg.version}`;

const toSnackCase = (s) => s.replace(/-(\w)/g, (_, p1) => p1.toUpperCase());

const BUILD_ENV = process.argv[2] || '';
console.log(`current build env: ${BUILD_ENV}`);

function generateTasks() {
  const apps = readDirPages(pagesDir);
  return apps.map((app) => {
    const appName = app;
    return {
      appName,
      configName: `MPA_${toSnackCase(appName)}`,
      routeConfig: handleRouteTemplate(appName),
    };
  });
}

const tasks = generateTasks();
const distPath = path.join(__dirname, `../dist`);

if (fs.existsSync(distPath)) {
  fse.removeSync(distPath);
}

// 至少保证 10 个进程同时编译
const maxWorkerCount = Math.max(10, cpuCount);
let workerCount = 0;
for (let i = 0; i < maxWorkerCount; i++) {
  if (tasks.length !== 0) {
    const task = tasks.pop();
    workerCount++;
    buildTask(task);
  }
}
console.log(`CPU_COUNT: ${cpuCount}, WORKER_COUNT: ${workerCount}`);

function getConfigStr(task) {
  let publicPathPrefix = '';
  switch (BUILD_ENV) {
    case 'sdb':
      publicPathPrefix = `/${packageVersion}`;
      return `
        import { defineConfig } from 'umi';
        import webpack from 'webpack';
        const chainWebpackConfigs = require('./webpack');
        export default defineConfig({
          subApp: '${task.appName}',
          plugins: ['./config/umi-plugin-mpa'],
          publicPath: '${publicPathPrefix}/${task.appName}/',
          define: {
            _SITE_: 'site-sdb',
            IS_INSIDE_WEB: false,
            IS_TEST_ENV: false,
            IS_SANDBOX: true,
          },
          outputPath: '/dist/${packageVersion}/${task.appName}',
          routes: ${JSON.stringify(task.routeConfig)},
          chainWebpack(memo) {
            chainWebpackConfigs(memo, webpack, {
              isDev: false,
              publicPathForLoader: '${publicPathPrefix}/',
              packageVersion: '${packageVersion}',
            });
          },
        })
      `;
    case 'sit':
      publicPathPrefix = `/${packageVersion}`;
      return `
        import { defineConfig } from 'umi';
        import webpack from 'webpack';
        const chainWebpackConfigs = require('./webpack');
        export default defineConfig({
          subApp: '${task.appName}',
          plugins: ['./config/umi-plugin-mpa'],
          publicPath: '${publicPathPrefix}/${task.appName}/',
          define: {
            _SITE_: 'sit',
            IS_INSIDE_WEB: false,
            IS_TEST_ENV: true,
            IS_SANDBOX: false,
          },
          outputPath: '/dist/${packageVersion}/${task.appName}',
          routes: ${JSON.stringify(task.routeConfig)},
          chainWebpack(memo) {
            chainWebpackConfigs(memo, webpack, {
              isDev: false,
              publicPathForLoader: '${publicPathPrefix}/',
              packageVersion: '${packageVersion}',
            });
          },
        })
      `;
    case 'cn':
      publicPathPrefix = `https://assets2.staticimg.com/${packageVersion}`;
      return `
        import { defineConfig } from 'umi';
        import webpack from 'webpack';
        const chainWebpackConfigs = require('./webpack');
        export default defineConfig({
          subApp: '${task.appName}',
          plugins: ['./config/umi-plugin-mpa'],
          favicon: 'https://assets2.staticimg.com/cms/media/7AV75b9jzr9S8H3eNuOuoqj8PwdUjaDQGKGczGqTS.png',
          publicPath: '${publicPathPrefix}/${task.appName}/',
          define: {
            _SITE_: 'site-cn',
            IS_INSIDE_WEB: true,
            IS_TEST_ENV: false,
            IS_SANDBOX: false,
          },
          outputPath: '/dist/${packageVersion}/${task.appName}',
          routes: ${JSON.stringify(task.routeConfig)},
          chainWebpack(memo) {
            chainWebpackConfigs(memo, webpack, {
              isDev: false,
              publicPathForLoader: '${publicPathPrefix}/',
              packageVersion: '${packageVersion}',
            });
          },
        })
      `;
    default:
      publicPathPrefix = `https://assets.staticimg.com/${packageVersion}`;
      return `
        import { defineConfig } from 'umi';
        import webpack from 'webpack';
        const chainWebpackConfigs = require('./webpack');
        export default defineConfig({
          subApp: '${task.appName}',
          plugins: ['./config/umi-plugin-mpa'],
          publicPath: '${publicPathPrefix}/${task.appName}/',
          outputPath: '/dist/${packageVersion}/${task.appName}',
          routes: ${JSON.stringify(task.routeConfig)},
          chainWebpack(memo) {
            chainWebpackConfigs(memo, webpack, {
              isDev: false,
              publicPathForLoader: '${publicPathPrefix}/',
              packageVersion: '${packageVersion}',
            });
          },
        })
      `;
  }
}

function generatorConfig(task) {
  const configStr = getConfigStr(task);
  fs.writeFileSync(`${configDir}/config.${task.configName}.js`, configStr);
}

function buildTask(task) {
  generatorConfig(task);

  // const currentDistPath = `${distPath}/logs/${task.appName}`;
  // fs.mkdirSync(currentDistPath, { recursive: true });
  // const out = fs.openSync(`${currentDistPath}/stdout.log`, 'a');
  // const err = fs.openSync(`${currentDistPath}/stderr.log`, 'a');

  console.log(`Task: ${task.configName} start build...`);
  const worker = child_process.spawn(
    'cross-env',
    ['NODE_OPTIONS=--max_old_space_size=4096', `BUILD_ENV=${BUILD_ENV}`, `UMI_ENV=${task.configName}`, 'umi', 'build'],
    {
      detached: true,
      stdio: ['ignore', 'ignore', 'pipe'],
    },
  );

  worker.stderr.on('data', err => {
    console.error(err.toString());
  });

  worker.on('close', (code) => {
    // clear tmp files
    fs.unlinkSync(`${configDir}/config.${task.configName}.js`);
    fse.removeSync(`${srcDir}/.umi-production-${task.appName}`);
    if (code === 0) {
      console.log(`Task: ${task.configName} finished`);
      process.nextTick(() => {
        if (tasks.length !== 0) {
          const task = tasks.pop();
          buildTask(task);
        } else {
          workerCount--;
          if (workerCount === 0) {
            // post build
            console.log('post build start');
            const p = child_process.spawn('node', [`${__dirname}/mpa/postBuild.js`, BUILD_ENV]);
            p.stdout.on('data', (data) => {
              console.log(`${data}`);
            });
          }
        }
      });
    } else {
      throw new Error(`Task: ${task.configName} error`);
    }
  });
}

process.on('uncaughtException', err => {
  console.error(err);
  process.exit(1);
});
