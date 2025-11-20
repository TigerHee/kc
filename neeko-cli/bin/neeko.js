#!/usr/bin/env node

/**
 * Owner: simple@kupotech.com
 */
const program = require('commander');
const _inquirer = require('inquirer');
const init = require('../lib/init');
const chalk = require('chalk');
const _export = require('../lib/export');
const _import = require('../lib/import');
const _lokalise = require('../lib/lokalise');
const _diff = require('../lib/diff');

const log = console.log;

program
  .version(`@kc/neeko ${require('../package').version}`)
  .usage('<command> [options]');

program
  .command('init')
  .description('generate .neeko workspace and config file')
  .action(init);

program
  .command('export')
  .description('export the language(s) from the specified file or folder')
  .option('-a, --all', 'export all locales in dir config')
  .option('-i, --increment', 'export increment local key')
  .option('-s, --specify', 'export specify local keys')
  .option('-e, --excel', 'export excel in xlsx format')
  .action((cmdObj) => {
    if (!cmdObj.all && !cmdObj.increment && !cmdObj.specify) {
      log(chalk.cyan('please run export command with -a or -i or -k option! (neeko-cli --help)'));
    } else {
      _export(cmdObj);
    }
  });

program
  .command('import')
  .description('import the language(s) from csv template')
  .option('-m, --merge', 'merge language(s) into source locale file')
  .option('-r, --replace', 'replace source locale file with a new locale file')
  .action((cmdObj) => {
    if (!cmdObj.merge && !cmdObj.replace) {
      log(chalk.cyan('please run import command with -m or -r option! (neeko-cli --help)'));
    } else {
      _import(cmdObj);
    }
  });

program
  .command('lokalise')
  .description('operating language packs from lokalise')
  .option('-ak, --addApiKey', 'add global lokalise apiKey (require)')
  .option('-rk, --removeApiKey', 'remove global lokalise apiKey')
  .option('-r, --replace', 'completely use the new language pack, replace the original language pack, do not retain the difference')
  .option('-m, --merge', 'merge into the original language pack, merge the differences, do not delete the nonexistent key, and replace the same key')
  .option('-a, --add', 'only new key, do not delete the nonexistent key, do not replace the same key')
  .option('-t, --task', 'To publish a new translation task, you must configure .neeko.task.json before executing')
  .option('--edit', 'If you are publishing a task to modify an existing key, you need to use this')
  .option('--upload', 'Use it with caution, upload localized translation content that does not exist, and try to use it only during the stay')
  .option('--initial', 'It is used when uploading. Setting this item indicates that it is the first time to upload. It is used when initializing the translation content of lokalise project')
  .action((cmdObj) => {
    if (
      !cmdObj.replace &&
      !cmdObj.merge &&
      !cmdObj.add &&
      !cmdObj.upload &&
      !cmdObj.task &&
      !cmdObj.addApiKey &&
      !cmdObj.removeApiKey
    ) {
      log(
        chalk.cyan(
          '请使用一个命令进行lokalise的具体操作! (neeko lokalise --help)',
        ),
      );
    } else if (cmdObj.initial) {
      // 初始化上传操作需要二次确认
      _inquirer.prompt([
        {
          type: 'confirm',
          name: 'checked',
          message: '确认全量上传翻译内容到lokalise？'
        }
      ]).then((answers) => {
        if (answers.checked) {
          _lokalise(cmdObj);
        } else {
          console.log('已取消上传操作');
        }
      }).catch((error) => {
        console.log(error);
      });
    } else if (cmdObj.replace) {
      // 全量替换需要二次确认
      _inquirer.prompt([
        {
          type: 'input',
          name: 'confirmText',
          message: '\n危险操作！！！\n确认是否使用lokalise的数据全量替换本地翻译内容（若本地有未上传key可能会丢失）\n输入"确认替换"进行确认'
        }
      ]).then((answers) => {
        if (answers.confirmText === '确认替换') {
          _lokalise(cmdObj);
        } else {
          console.log('已取消替换操作');
        }
      }).catch((error) => {
        console.log(error);
      });
    } else if (cmdObj.task) {
      // 发布任务需要二次确认
      const str = cmdObj.edit ? '即将修改key对应属性' : '开始发布新建任务';
      _inquirer.prompt([
        {
          type: 'confirm',
          name: 'checked3',
          message: `${str}，确定.neeko.task.json已经配置完成？`
        }
      ]).then((answers) => {
        if (answers.checked3) {
          _lokalise(cmdObj);
        } else {
          console.log('已取消任务发布操作');
        }
      }).catch((error) => {
        console.log(error);
      });
    } else {
      _lokalise(cmdObj);
    }
  });

program
  .command('diff')
  .description('diff project never used locale key, readMore: https://wiki.kupotech.com/pages/viewpage.action?pageId=91347436')
  .option('-as, --addTaskSession', 'set http://10.40.0.201 project session')
  .option('-rs, --removeTaskSession', 'remove http://10.40.0.201 project session')
  .action((cmdObj) => {
    _diff(cmdObj);
  })

program.parse(process.argv);
