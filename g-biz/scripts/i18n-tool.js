#!/usr/bin/env node
/**
 * Owner: sean.shi@kupotech.com
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const process = require('process');

// 所有翻译项目目录
const allPackages = [
  'captcha',
  'common-base',
  'downloadBanner',
  'entrance',
  'footer',
  'header',
  'kyc',
  'notice-center',
  'security',
  'share',
  'userRestrictedCommon',
  'convert',
  'transfer',
  'verification',
  'siteRedirect',
  'trade',
];

// 创建 readline 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ANSI 颜色代码
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  blink: '\x1b[5m',
  inverse: '\x1b[7m',
  hidden: '\x1b[8m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

// 彩色输出函数
function colorize(text, color) {
  return `${color}${text}${colors.reset}`;
}

// 打印标题
function printTitle() {
  const title = 'I18N 自动更新工具';
  const line = '='.repeat(title.length + 8);

  console.log(colorize(`${line} `, colors.bgBlue + colors.white));
  console.log(colorize(`  ${title}   `, colors.bgBlue + colors.white + colors.bold));
  console.log(colorize(`${line} `, colors.bgBlue + colors.white));
  console.log();
}

// 引导输入
function ask(question) {
  return new Promise((resolve) => {
    rl.question(colorize(`\n${question} `, colors.yellow), (answer) => {
      resolve(answer);
    });
  });
}

// 确认对话框
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(colorize(`\n${question} (y/n) `, colors.yellow), (answer) => {
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

// 执行命令
function executeCommand(command, description) {
  console.log(colorize(`\n${description}:`, colors.blue));

  try {
    execSync(command, { stdio: 'inherit' });
    console.log(colorize(`✓ ${description} 执行成功!`, colors.green));
    return true;
  } catch (error) {
    console.log(colorize(`✗ ${description} 执行失败: ${error.message}`, colors.red));
    return false;
  }
}

// 执行 neeko
async function execNeeko(name) {
  // 检查 neeko 是否可用
  try {
    execSync('neeko --version', { stdio: 'ignore' });
  } catch {
    console.log(colorize('\n错误: neeko 命令未找到, 请自行检查', colors.red));
    process.exit(0);
  }

  let neekoSuccess = true;
  do {
    // 执行 neeko 命令
    neekoSuccess = executeCommand('neeko lokalise -m', `${name} 运行 neeko lokalise -m`);
    if (!neekoSuccess) {
      const retry = await askQuestion('neeko 命令执行失败，是否重试?');
      // 不重试，则退出
      if (!retry) {
        console.log(colorize('\nneeko 命令执行失败，已退出', colors.yellow));
        process.exit(0);
      }
    }
  } while (!neekoSuccess);
}

// 执行 i18n 转换脚本
async function execI18N() {
  console.log(colorize(`\n执行 i18n 转换脚本:`, colors.blue));
  allPackages.forEach((pkg) => {
    const cjsPath = path.resolve(__dirname, `../packages/${pkg}/src/locale/cjs`);

    try {
      fs.mkdirSync(cjsPath);
    } catch (e) {
    } finally {
      const files = fs.readdirSync(path.resolve(__dirname, `../packages/${pkg}/src/locale`));

      files
        .filter((file) => file !== 'cjs' && file !== 'index.js' && !/\.json$/.test(file))
        .forEach((file) => {
          let content = fs.readFileSync(
            path.resolve(__dirname, `../packages/${pkg}/src/locale`, file),
            'utf-8',
          );

          content = content.replace('export default', 'module.exports =');

          fs.writeFileSync(
            path.resolve(__dirname, `../packages/${pkg}/src/locale/cjs/`, file),
            content,
          );
        });

      files
        .filter((file) => file !== 'cjs' && file !== 'index.js' && !/\.json$/.test(file))
        .forEach((file) => {
          const locale = require(path.resolve(
            __dirname,
            `../packages/${pkg}/src/locale/cjs/`,
            file,
          ));
          fs.writeFileSync(
            path.resolve(__dirname, `../packages/${pkg}/src/locale`, file.replace('.js', '.json')),
            JSON.stringify(locale, null, 2),
          );
        });

      // 清理 cjs 目录
      execSync(`rm -rf ${cjsPath}`);
    }
  });
  console.log(colorize(`✓ 执行 i18n 转换脚本成功!`, colors.green));
}

async function selectSignleProject() {
  let package = '';
  do {
    // 让用户选择项目
    package = await ask('请输入要生成的项目目录名称');

    // 没有输入，直接退出
    if (!package) {
      console.log(colorize('\n未选择任何项目，程序退出。', colors.yellow));
      process.exit(0);
    }

    // 没有匹配到，提示
    if (!allPackages.includes(package)) {
      console.log(
        colorize('\n项目名称: ', colors.yellow),
        colorize(package, colors.red),
        colorize('不存在', colors.yellow),
      );
      const likePackages = allPackages.filter((item) => item.startsWith(String(package).charAt(0)));
      if (likePackages.length) {
        console.log(colorize('\n❓ 您是否要输入的是以下项目: ', colors.white + colors.bold));
        console.log(colorize(`\n${likePackages.join(',')}`, colors.green));
      }
      package = '';
    }
  } while (!package);
  return package;
}

// 主函数
async function main() {
  try {
    printTitle();
    // 检查 Node.js 版本
    const nodeVersion = process.versions.node;
    console.log(colorize(`Node.js 版本: ${nodeVersion}`, colors.dim));

    const currentCWD = process.cwd();

    const defaultProject = process.argv && process.argv[2] ? process.argv[2].split('=')[1] : '';

    let updateProjectList = [];
    // 如果命令中传入 all, 则一次性执行所有项目翻译
    if (defaultProject === 'all') {
      updateProjectList = allPackages.slice(0);
    } else if (allPackages.includes(defaultProject)) {
      // 如果命令中有具体项目，直接更新翻译
      updateProjectList.push(defaultProject);
    } else {
      // 否则交互式
      const project = await selectSignleProject();
      updateProjectList.push(project);
    }

    console.log(colorize('\n请耐心等待...', colors.blue));
    await updateProjectList.reduce((prev, item) => {
      return prev.then(() => {
        // 切换到翻译项目中
        process.chdir(path.join(currentCWD, 'packages', item));

        return execNeeko(item);
      });
    }, Promise.resolve());

    process.chdir(currentCWD);
    await execI18N();

    // 完成提示
    console.log(colorize('\n✅ 翻译更新已完成!', colors.bgGreen + colors.white + colors.bold));
  } catch (error) {
    console.log(colorize(`\n发生错误: ${error.message}`, colors.bgRed + colors.white));
  } finally {
    rl.close();
  }
}

// 启动程序
main();
