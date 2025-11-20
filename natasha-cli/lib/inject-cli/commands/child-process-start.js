#!/usr/bin/env node
const detect = require('detect-port');
const inquirer = require('inquirer');
const parse = require('yargs-parser');
const { start } = require('build-scripts');
const log = require('build-scripts/lib/utils/log');
const path = require('path');

const rawArgv = parse(process.argv.slice(2), {
  configuration: { 'strip-dashed': true }
});

const DEFAULT_PORT = rawArgv.port || process.env.PORT;

if (DEFAULT_PORT) {
  process.env.USE_CLI_PORT = true;
}

const defaultPort = parseInt(DEFAULT_PORT || 3000, 10);

(async () => {
  let newPort = await detect(defaultPort);
  if (newPort !== defaultPort) {
    const question = {
      type: 'confirm',
      name: 'shouldChangePort',
      message: `${defaultPort} 端口已被占用，是否使用 ${newPort} 端口启动？`,
      default: true
    };
    const answer = await inquirer.prompt(question);
    if (!answer.shouldChangePort) {
      newPort = null;
    }
  }
  if (newPort === null) {
    process.exit(1);
  }

  process.env.NODE_ENV = 'development';
  rawArgv.port = parseInt(newPort, 10);

  const { rootDir = process.cwd() } = rawArgv;

  delete rawArgv.rootDir;
  // ignore _ in rawArgv
  delete rawArgv._;

  try {
    const devServer = await start({
      args: { ...rawArgv },
      plugins: [require.resolve('../../build-plugin-react-app')],
      rootDir: path.isAbsolute(rootDir) ? rootDir : path.join(process.cwd(), rootDir)
    });

    ['SIGINT', 'SIGTERM'].forEach(function (sig) {
      process.on(sig, async function () {
        if (devServer.close) {
          devServer.close();
        } else if (devServer.stop) {
          await devServer.stop();
        }
        process.exit(0);
      });
    });
  } catch (err) {
    log.error(err.message);
    console.error(err);
    process.exit(1);
  }
})();
