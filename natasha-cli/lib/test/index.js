const { runCLI } = require('jest');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');

const mergeConfig = require('../utils/mergeConfig');

const createDefaultConfig = require('./createDefaultConfig');

async function patch (args) {
  const cwd = args.cwd || process.cwd();

  const packageJSONPath = path.join(cwd, 'package.json');

  const name = fs.existsSync(packageJSONPath) && require(packageJSONPath).name;

  const config = mergeConfig(createDefaultConfig({ name }));

  await runCLI(
    {
      config: JSON.stringify(config)
    },
    [cwd]
  );
}

async function run (args) {
  patch(args).catch((e) => {
    console.error(chalk.red(e));
    process.exit(1);
  });
}

module.exports = run;
