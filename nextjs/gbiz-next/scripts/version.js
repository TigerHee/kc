const inquirer = require('inquirer');
const simpleGit = require('simple-git');
const { cwd } = require('process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const semver = require('semver');
const { execSync } = require('child_process');
const ora = require('ora');

const git = simpleGit();

const typeColor = {
  major: 'red',
  minor: 'blue',
  patch: 'yellow',
  beta: 'gray',
};

const execa = (command) => execSync(command).toString();

const hash = execa('git log -1 --pretty=format:%h');

// 获取当前项目的 package.json 路径
function getPackageJsonPath() {
  return path.join(cwd(), 'package.json');
}

// 读取当前版本
function getCurrentVersion() {
  const pkgPath = getPackageJsonPath();
  const pkg = require(pkgPath);
  return pkg.version;
}

// 更新版本号
function updateVersion(type) {
  const pkgPath = getPackageJsonPath();
  const pkg = require(pkgPath);
  let version;
  
  if (type !== 'beta') {
    version = semver.inc(pkg.version, type);
  } else {
    // 如果版本号里面已经带了beta
    if (pkg.version.includes('beta')) {
      const v = semver.coerce(pkg.version);
      version = `${v}-beta.${hash}`;
    } else {
      const v = semver.inc(pkg.version, 'patch');
      version = `${v}-beta.${hash}`;
    }
  }
  
  pkg.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
  return version;
}

// 选择版本类型
async function selectVersionType() {
  const { versionType } = await inquirer.prompt({
    type: 'list',
    name: 'versionType',
    message: 'What type of version bump would you like?',
    choices: [
      { name: `${chalk.red('major')} - Breaking changes`, value: 'major' },
      { name: `${chalk.blue('minor')} - New features`, value: 'minor' },
      { name: `${chalk.yellow('patch')} - Bug fixes`, value: 'patch' },
      { name: `${chalk.gray('beta')} - Beta release`, value: 'beta' },
    ],
  });
  return versionType;
}

// 确认版本更新
async function confirmVersionUpdate(currentVersion, newVersion, type) {
  const { confirm } = await inquirer.prompt({
    type: 'confirm',
    name: 'confirm',
    message: `Update version from ${chalk.cyan(currentVersion)} to ${chalk.green(newVersion)} (${chalk[typeColor[type]](type)})?`,
    default: true,
  });
  return confirm;
}

async function version() {
  try {
    // 获取当前版本
    const currentVersion = getCurrentVersion();
    console.log(chalk.cyan(`Current version: ${currentVersion}`));
    
    // 选择版本类型
    const versionType = await selectVersionType();
    
    // 计算新版本
    let newVersion;
    if (versionType !== 'beta') {
      newVersion = semver.inc(currentVersion, versionType);
    } else {
      if (currentVersion.includes('beta')) {
        const v = semver.coerce(currentVersion);
        newVersion = `${v}-beta.${hash}`;
      } else {
        const v = semver.inc(currentVersion, 'patch');
        newVersion = `${v}-beta.${hash}`;
      }
    }
    
    // 确认更新
    const confirmed = await confirmVersionUpdate(currentVersion, newVersion, versionType);
    
    if (!confirmed) {
      console.log(chalk.yellow('Version update cancelled.'));
      process.exit(0);
    }
    
    // 更新版本
    const spinner = ora('Updating version...').start();
    
    try {
      updateVersion(versionType);
      
      // 提交更改
      await git.add('.');
      await git.commit(`chore(t-teams-teach): prepare versions to ${newVersion}`);
      
      spinner.stop();
      console.log(chalk.green(`✅ Version updated successfully to ${newVersion}`));
      console.log(chalk.gray('Changes have been committed to git.'));
      
    } catch (error) {
      spinner.stop();
      console.log(chalk.red('❌ Failed to update version:'), error.message);
      process.exit(1);
    }
    
  } catch (error) {
    console.log(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  version();
}

module.exports = { version, updateVersion, getCurrentVersion };
