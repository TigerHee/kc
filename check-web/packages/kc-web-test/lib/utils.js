const axios = require('axios')
const https = require('https')
const child_process = require('child_process')
const ULID = require('ulid')

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m'
}

const emailReg = '\\s?\\w+([-+\\.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$'
exports.emailReg = emailReg

const log = {
  red: (...msg) => {
    console.log(colors.red, ...msg, '\x1b[;0m')
  },
  green (...msg) {
    console.log(colors.green, ...msg, '\x1b[;0m')
  },
  info (...msg) {
    console.log(...msg)
  }
}
exports.log = log

const exec = async (_cmdLine, logLevel = 'silent', resolveLogFn = () => {}) => {
  // console.log('exec: ', _cmdLine, logLevel);
  return new Promise(resolve => {
    const child = child_process.exec(_cmdLine, (error, stdout, stderr) => {
      resolve({
        error: error,
        data: stdout
      })
    })
    child.stdout.on('data', (...msg) => {
      if (logLevel !== 'silent') {
        log.info(...msg)
      }
      resolveLogFn('[stdout]:', ...msg)
    })
    child.stderr.on('data', (...msg) => {
      if (logLevel !== 'silent') {
        log.red(...msg)
      }
      resolveLogFn('[stderr]:', ...msg)
    })
  })
}
exports.exec = exec

const spawn = async (cmd, args = [], opts = {}) => {
  return new Promise(resolve => {
    const _cp = child_process.spawn(cmd, args, {
      stdio: 'inherit',
      ...opts
    })
    _cp.on('close', code => {
      console.log('exit')
      resolve({
        code: code
      })
    })
  }).catch(e => {
    return {
      error: e
    }
  })
}

exports.spawn = spawn

// teams 通知
const reportTeams = async (msgs, isDev = false) => {
  if (isDev) {
    return
  }
  const _id = ULID.ulid()
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    const header = process.env.TEAMS_NOTIFY_TOKEN
    if (!header) {
      console.log('teams token not found')
      return
    }
    const result = await axios.post(
      'https://kufox-bot.kcprd.com/api/notify',
      //  `https://kufox.kcprd.com/api/notify`,
      {
        // [{"text": "数据库:10.30.11.10当前时间数据未进 行备份，请重点关注"}]
        message: msgs instanceof Array ? msgs : [msgs],
        receiver: {
          conversation:
            process.env.NODE_ENV === 'development'
              ? '19:ecc4c4410af6417daccb764e998fafaa@thread.v2'
              : '19:527876ef12744323af6464b23ec7d1c2@thread.v2'
          // "conversation" : "19:e6d87af360cc4a60b0a911274df36194@thread.v2"
        },
        id: _id.toString()
      },
      {
        headers: {
          Authorization: `Bearer ${header}`,
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    )
    if (result) {
      console.log('report teams:', 'test success')
    }
  } catch (e) {}
}
exports.reportTeams = reportTeams

// 获取当前构建信息
const getBuildInfo = () => {
  const branch = process.env.BRANCH_NAME
  const { name: projectName } = require(`${process.env.PWD}/package.json`)

  return {
    branch,
    project: projectName
  }
}

exports.getBuildInfo = getBuildInfo

// 带有构建信息的通知
const reportWithBuildInfo = async (type, msg = '') => {
  const buildInfo = getBuildInfo()
  // 如果不是测试环境，那么不进行通知
  if (!buildInfo.branch) {
    return
  }

  await reportTeams({
    text: `<div><b>通知:</b> ${buildInfo.project} ｜ ${buildInfo.branch} <div>${type} ${msg}</div>
        </div>`
  })
}

exports.reportWithBuildInfo = reportWithBuildInfo

const baseUri = 'https://check-web-node.sit.kucoin.net/api'
// const baseUri = 'http://localhost:3000/api';

const request = axios.create({
  baseURL: baseUri,
  // baseURL: 'http://localhost:3000/api',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})

exports.request = request

const projectAliasMap = {
  'kumex-pro': 'website',
  'kumex-lite': 'website_next'
}
exports.projectAliasMap = projectAliasMap
