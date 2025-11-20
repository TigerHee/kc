const program = require('commander');
const create = require('./commands/create');
const start = require('./commands/start');
const build = require('./commands/build');
const release = require('@natasha/release/lib');
const packageInfo = require('../../package.json');
const { checkNodeVersion } = require('../utils/env');

module.exports = () => {
  // 校验 node 版本，node 版本不满足 package.json engines.node 直接退出
  checkNodeVersion(packageInfo.engines.node, packageInfo.name);

  program.version(packageInfo.version).usage('<command> [options]');

  process.env.__NATASHA_VERSION__ = packageInfo.version;

  program
    .command('create <app-name>')
    .allowUnknownOption()
    .description('create a new project powered by natasha-cli')
    .action(create);

  program
    .command('start')
    .description('start server')
    .allowUnknownOption()
    .option('--inspect', 'enable the Node.js inspector')
    .option('-p, --port <port>', 'dev server port')
    .option('--rootDir <rootDir>', 'project root directory')
    .action(start);

  program
    .command('build')
    .description('build project')
    .allowUnknownOption()
    .option('--rootDir <rootDir>', 'project root directory')
    .action(build);

  program
    .command('release')
    .description('release a npm package')
    .allowUnknownOption()
    .option('--registry <registry>', 'npm registry')
    .action(release);

  // 判断是否有正在运行的命令，如果有，则退出已执行的命令
  const proc = program.runningCommand;
  if (proc) {
    proc.on('close', process.exit.bind(process));
    proc.on('error', () => {
      process.exit(1);
    });
  }

  program.parse(process.argv);

  const subCmd = program.args[0];
  if (!subCmd) {
    program.help();
  }
};
