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
    const header = process.env.TEAMS_NOTIFY_TOKEN
    if (!header) {
      console.log('teams token not found')
      return
    }
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    const result = await axios.post(
      'https://kufox-bot.kcprd.com/api/notify',
      // `https://kufox.kcprd.com/api/notify`,
      {
        // [{"text": "数据库:10.30.11.10当前时间数据未进 行备份，请重点关注"}]
        message: msgs instanceof Array ? msgs : [msgs],
        receiver: {
          // conversation: ,
          conversation:
            process.env.NODE_ENV === 'development'
              ? '19:ecc4c4410af6417daccb764e998fafaa@thread.v2'
              : '19:527876ef12744323af6464b23ec7d1c2@thread.v2'
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
    console.log('report teams:', result.data)
  } catch (e) {
    console.log('report teams error:', e.message)
  }
}
exports.reportTeams = reportTeams

// ci 通知
const reportCi = async (
  {
    build_user,
    status,
    text,
    build_link,
    repo,
    branch,
    commit_id,
    project_key
  },
  isDev = false
) => {
  if (isDev) {
    console.log('msgs: ', text)
    return
  }
  try {
    const header = process.env.TEAMS_NOTIFY_TOKEN
    if (!header) {
      console.log('teams token not found')
      return
    }
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    const params = {
      error_code: 10035,
      receiver: build_user,
      params: {
        status,
        web_checker_text: `
        <p><b>仓库：</b> ${repo}</p>
        <p style="margin-bottom:5px"><b>分支：</b>
        ${branch} - <a href="https://bitbucket.kucoin.net/projects/${project_key}/repos/${repo}/commits/${commit_id}">
        ${commit_id?.substring(0, 10)}</a>
        </p>${text}`,
        web_checker_url: `https://check-web-node.sit.kucoin.net/test/${repo}/${encodeURIComponent(
          branch
        )}`,
        build_url: build_link
      }
    }

    await axios
      .post('https://kufox.kcprd.com/api/helper/', params, {
        headers: {
          // Authorization: `Bearer ${header}`,
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
      .catch(e => {
        console.log('report kufox error: ', e?.message)
      })
  } catch (e) {
    // console.log(e);
  }
}

// 规范平台 通知
const reportTask = async (taskId, isDev) => {
  const host = 'https://insight.kcprd.com'
  if (isDev) {
    host = 'http://localhost:3000'
  }
  try {
    const { data } = await axios.get(`${host}/api/tasks?taskId=${taskId}`, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
    return data
  } catch (e) {
    console.log(e)
    return []
  }
}

exports.reportTask = reportTask

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

const InfoStatusColors = {
  success: 'green',
  error: 'red',
  info: 'inherit'
}

// 带有构建信息的通知
const reportWithBuildInfo = async (type, ciOptions = {}) => {
  const { build_user, build_link, repo, commit_id, project_key } =
    ciOptions || {}
  const web_checker_url = `https://check-web-node.sit.kucoin.net/app/projects/${repo}/dashboard`
  const buildInfo = getBuildInfo()
  // 如果不是测试环境，那么不进行通知
  if (!buildInfo.branch) {
    return
  }
  const ciText = build_user
    ? `<div><b>builder:</b> ${build_user} ｜ 
    <a href="https://bitbucket.kucoin.net/projects/${project_key}/repos/${repo}/commits/${commit_id}">
    ${commit_id?.substring(0, 10)}
    </a>
   </div>`
    : ''
  const buttons = build_link
    ? [
        { title: '查看Web报告', open_url: web_checker_url },
        { title: '查看构建历史', open_url: build_link }
      ]
    : []
  const text = {
    text: `<div>
      <b>通知:</b> ${buildInfo.project} ｜ ${buildInfo.branch}
      ${ciText}
      <div>${type}</div>
    </div>`
  }
  const ciCard = {
    herocards: [
      {
        ...text,
        buttons
      }
    ]
  }
  await reportTeams(build_user ? ciCard : text, !buildInfo.branch)
}

exports.reportWithBuildInfo = reportWithBuildInfo

// 通知kufox
const reportWithKufoxInfo = async ciOptions => {
  // 如果不是ci环境，那么不进行通知
  if (!ciOptions.commit_id) {
    // console.log("info", type, msg);
    return
  }
  //生产CI记录
  const kufoxRequest = axios.create({
    baseURL: ' https://kufox.kcprd.com/api',
    // baseURL: 'http://localhost:3000/api',
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  })
  try {
    const { data } = await kufoxRequest.post('/daily-build/cicd_check_item', {
      projectKey: ciOptions.project_key,
      repoName: ciOptions.repo,
      branchName: ciOptions.branch,
      commitId: ciOptions.commit_id,
      createUser: ciOptions.build_user,
      scanState: ciOptions.scan_state,
      passState: ciOptions.pass_state,
      appType: 'web',
      checkType: 'web-checker'
    })
    console.log('ci kufox 接口: ', data)
    return data
  } catch (e) {
    console.log('ci kufox failed: 请重新触发CI', e.message || e)
    process.exit(1)
  }

  // const status = extraStatus
  //   ? `-${extraStatus}`
  //   : `-End：<span style="color: ${
  //       CiStatus[code] === 'NoPass' ? 'red' : 'green'
  //     }"><b>${CiStatus[code]}</b></span>`;

  // await reportCi({
  //   text,
  //   status,
  //   ...ciOptions,
  // });
}

exports.reportWithKufoxInfo = reportWithKufoxInfo

const StatusMap = {
  PASS: 'green',
  FAIL: 'red'
}

exports.genInfoHTML = (cate, statu, extraInfo = '') => {
  return `<b>${cate}</b>: <span style="color: ${StatusMap[statu]}">${statu}</span>${extraInfo}`
}

const request = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api'
      : 'https://check-web-node.sit.kucoin.net/api',

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

async function getCiMasterRecord (type) {
  try {
    const { project } = getBuildInfo()
    const { data } = await request.get(
      `/ci/query-records?type=${type}&repo=${
        projectAliasMap[project] || project
      }&branch=master`
    )
    if (data.data && data.data[0]) {
      return data.data[0]
    }
    return {}
  } catch (e) {
    console.log('get ci master failed: ', e.message)
    return {}
  }
}
exports.getCiMasterRecord = getCiMasterRecord

/**
 *
 * @param {*} ciOptions
 */
async function updateCiRecord (ciRecord) {
  try {
    const { data } = await request.post('/ci/update-records', {
      ...ciRecord
    })
    console.log('update ci success: ', data)
    return data
  } catch (e) {
    console.log('update ci failed: ', e)
  }
}

exports.updateCiRecord = updateCiRecord

async function getProjectCheck (project) {
  try {
    const result = await request
      .get(`/test/query-config?project=${project}`)
      .then(res => res.data)
    return result
  } catch (e) {
    return {
      data: '{}'
    }
  }
}
exports.getProjectCheck = getProjectCheck

async function getCheckWebVersion () {
  try {
    const result = await request
      .get(`/checkweb/query-config`)
      .then(res => res.data)
    return result
  } catch (e) {
    return {
      data: '{}'
    }
  }
}
exports.getCheckWebVersion = getCheckWebVersion