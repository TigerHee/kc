const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const Mustache = require('mustache');
const execa = require('execa');
const validateProjectName = require('validate-npm-package-name');
const { hasGit } = require('../../utils/env');
const writeFiles = require('../../utils/writeFiles');

async function create (projectName) {
  const cwd = process.cwd();
  const inCurrent = projectName === '.';
  // 当前目录以目录名作为 projectName
  const name = inCurrent ? path.relative('../', cwd) : projectName;
  const targetDir = path.resolve(cwd, projectName || '.');
  // 校验 projectName 合法性
  const ret = validateProjectName(name);

  if (!ret.validForNewPackages) {
    console.error(chalk.red(`Invalid project name:"${name}"`));
    ret.errors && ret.errors.forEach(err => {
      console.error(chalk.red.dim('Error: ' + err));
    });
    ret.warnings && ret.warnings.forEach(warn => {
      console.error(chalk.red.dim('Warning: ' + warn));
    });
    process.exit(1);
  }

  if (fs.existsSync(targetDir)) {
    // 如果存在同名 dir，询问是否 remove dir
    const { removeDir } = await inquirer.prompt({
      type: 'confirm',
      name: 'removeDir',
      message: `${name} already existed, are you sure to remove ?`,
      default: true
    });
    if (removeDir) {
      console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
      await fs.remove(targetDir);
    } else {
      process.exit(1);
    }
  }
  // 使用模版创建 package.json
  const pkgTplPath = path.join(__dirname, '../.tpl/package.json.tpl');
  const pkgTpl = fs.readFileSync(pkgTplPath, 'utf-8');
  const pkg = Mustache.render(pkgTpl, { name });
  writeFiles(targetDir, {
    'package.json': pkg
  });

  // 检查环境 git , 如果存在，执行 git init
  if (hasGit()) {
    console.log('Initializing git repository...');
    await execa('git', ['init'], { cwd: targetDir });
  }

  console.log();
  console.log(`🎉  Successfully created project ${chalk.yellow(name)}.`);
  console.log();
}

module.exports = create;
