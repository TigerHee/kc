const chokidar = require('chokidar');
const { exec } = require('child_process');
const { debounce } = require('lodash-es');
const chalk = require('chalk');

let isBuilding = false;

const runCommand = debounce((eventType, path) => {
  if (isBuilding) {
    console.log('Compiling skip repeat...');
    return;
  }

  isBuilding = true;
  console.log(`Change: ${eventType} - ${path}`);
  console.log('开始编译...');

  exec('yarn push:project', (err, stdout, stderr) => {
    isBuilding = false;
    if (err) {
      console.error(chalk.red(`❌ 构建失败:`), err);
      return;
    }
    console.log(stdout);
    if (stderr) {
      console.error(chalk.red('构建警告:'), stderr);
    }
    console.log(chalk.green(`✅ 构建成功并推送 \r\n\r\n`));
  });
}, 1000); // 1秒内合并所有事件

chokidar
  .watch('src/**/*.{ts,tsx,scss}', {
    ignored: [
      /(^|[/\\])\../, // 忽略隐藏文件
      '**/dist/**', // 忽略构建输出目录
      '**/node_modules/**', // 忽略 node_modules
    ],
    awaitWriteFinish: {
      stabilityThreshold: 1000,
      pollInterval: 100,
    },
  })
  .on('all', (eventType, path) => {
    // console.log(`File change: ${eventType} ${path}`);
    runCommand(eventType, path);
  });
