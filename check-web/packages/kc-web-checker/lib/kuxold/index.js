const scanFile = require('./scanfile')
const { request, getBuildInfo, genInfoHTML } = require('../utils')
const { reportTeams } = require('./utils')
const Big = require('big.js')
const chalk = require('chalk')

async function reportResult (masterKuxOld, currentKuxOld, ciKuxOld) {
  try {
    const { branch, project } = getBuildInfo()
    const compare = masterKuxOld['left'] - currentKuxOld['left']
    if (compare === 0) {
      return {
        code: 0,
        msg: genInfoHTML('kuxold', 'PASS'),
        extraData: ciKuxOld
      }
    }

    let tableInfo =
      "<table bordercolor='black' border= '2'><thead><tr style = 'background-color : #f9cd0b; color: White'><th>branch</th><th>total files</th><th>left files</th><th>complete</th></tr></thead><tbody>"
    // v 是分类
    tableInfo += `<tr><td>master</td><td>${masterKuxOld['total']}</td ><td>${
      masterKuxOld['left']
    }</td ><td>${new Big(masterKuxOld['percent']).mul(100).toFixed(2)}%</td> `
    tableInfo += '</tr>'
    tableInfo += `<tr><td>current branch</td><td>${
      currentKuxOld['total']
    }</td ><td style="color:${compare > 0 ? 'green' : 'red'};"
      >${currentKuxOld['left']}</td ><td>${new Big(currentKuxOld['percent'])
      .mul(100)
      .toFixed(2)}%</td>`
    tableInfo += '</tr>'
    tableInfo += '</tbody></table>'

    await reportTeams({
      text: `<div> <b>旧组件扫描通知:</b> ${project} ｜ ${branch}</div > <div>${tableInfo}</div>`
    })
    const compareStatus = compare && compare < 0
    const compareMsg = ` (compare master: <span style="color: ${
      compareStatus ? 'red' : 'green'
    }">${compare || 0}</span>)`
    return {
      code: compareStatus ? 1 : 0,
      msg: genInfoHTML('kuxold', compareStatus ? 'FAIL' : 'PASS', compareMsg),
      extraData: ciKuxOld
    }
  } catch (e) {
    console.log('reportResult error', e)
  }
}

async function updateKuxOldRecord ({ left, total, percent }) {
  try {
    const count = `${left} /${total}`
    const { kuxold: masterData } = JSON.parse(process.env.CI_MASTER) || {}

    let masterLeft = 0
    let masterTotal = 1 // 默认值，防止除零错误

    const counts = masterData?.count?.split('/')
    if (counts && counts.length === 2) {
      masterLeft = parseInt(counts[0], 10) || 0
      masterTotal = parseInt(counts[1], 10) || 1 // 确保 masterTotal 不为零
    }
    const compare = new Big(masterLeft).minus(left).div(total).toFixed(4) || 0

    const ciKuxOld = {
      percent,
      compare,
      count
    }
    if (!masterData) {
      return { ciKuxOld, masterKuxOld: null }
    }
    const masterKuxOld = {
      total: masterTotal,
      left: masterLeft,
      percent: masterData.percent
    }

    const disableReport = process.env.BRANCH_NAME
    if (!disableReport) {
      console.log(
        `旧组件数量 当前分支:${
          compare >= 0 ? chalk.green(left) : chalk.red(left)
        } master:${masterLeft}`
      )
      process.exit(compare >= 0 ? 0 : 1)
    }

    return { ciKuxOld, masterKuxOld }
  } catch (e) {
    console.log('update kuxold failed: ', e)
  }
}

async function main () {
  const _reusedFiles = await scanFile()
  if (!_reusedFiles[0]) return
  Big.RM = 0

  const currentKuxOld = {
    total: _reusedFiles[0],
    left: _reusedFiles[1],
    percent: new Big(_reusedFiles[0])
      .minus(_reusedFiles[1])
      .div(_reusedFiles[0])
      .toFixed(4)
  }
  if (process.env.CI_MASTER) {
    const { masterKuxOld, ciKuxOld } = await updateKuxOldRecord(currentKuxOld)
    if (!masterKuxOld) {
      return {
        code: 0,
        msg: genInfoHTML('kuxold', 'PASS'),
        extraData: ciKuxOld
      }
    } else {
      return await reportResult(masterKuxOld, currentKuxOld, ciKuxOld)
    }
  } else {
    console.log('kuxold: ', currentKuxOld)
    return {
      code: 0
    }
  }
}

module.exports = main
