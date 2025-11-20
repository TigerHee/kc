#!/usr/bin/env node

const { program } = require('commander')
const cli = require('../lib/cli')
const {
  reportWithBuildInfo,
  reportWithKufoxInfo,
  updateCiRecord,
  getCiMasterRecord
} = require('../lib/utils')
const chalk = require('chalk')
const web_checks = []
const messages = []
let ciOptions = null
let excode = 0

process.once('beforeExit', async () => {
  if (messages.length && ciOptions) {
    const text = messages
      .map(msg => {
        return `<div>${msg}</div>`
      })
      .join('')

    await updateCiRecord({
      ...ciOptions,
      status: excode,
      web_checks: JSON.stringify(web_checks || '[]')
    })
    await reportWithBuildInfo(text, ciOptions)
    // scan_state: 扫描状态，1：等待扫描，2: 扫描中，3:扫描完成，4: 扫描异常
    // pass_state: pass状态，1：unknown，2: pass，3:no pass
    await reportWithKufoxInfo({
      ...ciOptions,
      scan_state: excode === 0 ? 3 : 4,
      pass_state: excode === 0 ? 2 : 3
    })
  }
  process.exit(excode)
})

program
  .option('-t, --type <type>', 'set check types')
  .option('-fo, --fixOwner <owner>', 'fix owner')
  .option('-diff, --diff', 'use git diff')
  /* ci options start*/
  .option('-repo, --repo <repo>', 'ci repo name')
  .option('-branch, --branch <branch>', 'ci branch name')
  .option('-commit_id, --commit_id <commit_id>', 'ci commit_id')
  .option('-build_link, --build_link <build_link>', 'ci build_link')
  .option('-build_user, --build_user <build_user>', 'ci build_user')
  .option('-project_key, --project_key <project_key>', 'ci project_key')
  .option('-git_url, --git_url <git_url>', 'ci git_url')
  /* ci options end*/
  .option('-msg, --msg <message>', 'git commit msg')
  .option('-limit, --limit <limit>', 'file limit size')
  .option('-path, --path <path...>', 'file path')
  .option('-exclude, --exclude <exclude...>', 'exclude file path')

program.parse(process.argv)

const options = program.opts()
const {
  diff = false,
  msg = '',
  limit = 150,
  path = ['src'],
  exclude = [],
  fixOwner,
  type,
  ...ci
} = options

const checkTypes = type ? type.split(',') : []

const checkAll = checkTypes.length === 0

;(async () => {
  const webChecks = [
    {
      type: 'owner',
      flag: checkAll || checkTypes.includes('owner'),
      func: cli.checkOwner
    },
    {
      type: 'eslint',
      flag: checkAll || checkTypes.includes('eslint'),
      func: cli.checkEslint
    },
    {
      type: 'test',
      flag: checkAll || checkTypes.includes('test'),
      func: cli.checkTest
    },
    {
      type: 'kuxold',
      flag: checkAll || checkTypes.includes('kuxold'),
      func: cli.checkKuxOld
    },
    {
      type: 'ts',
      flag: checkAll || checkTypes.includes('ts'),
      func: cli.checkTs
    },
    {
      type: 'depAnalyzer',
      flag: checkAll || checkTypes.includes('depAnalyzer'),
      func: cli.runDepTree
    },
    // {
    //   type: 'buildAnalyzer',
    //   flag: checkTypes.includes('buildAnalyzer'),
    //   func: cli.buildAnalyzer
    // },
    {
      type: 'commitlint',
      flag: checkTypes.includes('commitlint'),
      func: cli.checkCommitlint,
      isLocal: true
    },
    {
      type: 'size',
      flag: checkTypes.includes('size'),
      func: cli.checkSize,
      isLocal: true
    },
    {
      type: 'fixOwner',
      flag: checkTypes.includes('fixOwner'),
      func: cli.fixOwner,
      isLocal: true
    }
  ]
  const runTypes = webChecks
    .filter(check => check.flag && !check.isLocal)
    .map(check => check.type)

  // 有ci 参数执行ci构建
  if (ci.branch) {
    ciOptions = ci
    console.log('ci:', ciOptions)
    //用ci branch_name重置
    process.env.BRANCH_NAME = ciOptions.branch
    process.env.CI = JSON.stringify(ciOptions)
    console.log(chalk.yellow(`Start CI Checking: ${runTypes.join(', ')}`))
    await reportWithKufoxInfo({ ...ciOptions, scan_state: 2, pass_state: 1 })
  }

  if (runTypes.length > 0) {
    const masterData = await getCiMasterRecord(runTypes)
    process.env.CI_MASTER = JSON.stringify(masterData)
  }

  for (const check of webChecks) {
    if (check.flag) {
      if (!check.isLocal) {
        console.log(
          chalk.green(`============check ${check.type} start================`)
        )
      }

      const result = await check.func({
        diff,
        msg,
        limit,
        path,
        exclude
      })
      const { code: status = 0, msg: checkMsg, extraData } = result || {}
      if (checkMsg) {
        messages.push(checkMsg)
      }
      web_checks.push({
        type: check.type,
        status,
        extraData
      })
      if (!check.isLocal) {
        console.log(
          chalk.green(`============check ${check.type} end================`)
        )
      }
      if (status !== 0) {
        excode = status
        if (!ciOptions) {
          process.exit(excode)
        }
      }
    }
  }
})()
