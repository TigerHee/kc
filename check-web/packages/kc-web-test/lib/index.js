const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const cloneDeep = require('lodash.clonedeep')

const scanFile = require('./scanfile')
const { reportWithBuildInfo, request, projectAliasMap } = require('./utils')
const cwd = process.cwd()

const { name: ProjectName } = require(`${cwd}/package.json`)
const { getConfig } = require('./config')

const userJestConfigFile = require(path.join(cwd, 'jest.config.js'))

const disableReport = process.env.BRANCH_NAME

const config = getConfig()

const _report = async (type, msg) => {
  if (!disableReport) return
  return reportWithBuildInfo(type, msg)
}

async function reportResult (code, shouldForce = false, threshold) {
  if (code !== 0) {
    process.exit(code)
  }
  try {
    const _rslt = require(cwd + '/coverage/coverage-summary.json')
    console.log('result:', _rslt.total)

    const converage_detail = Object.entries(_rslt).reduce(
      (acc, [filePath, fileData]) => {
        // 去除cwd
        const trimmedFilePath = filePath.replace(`${cwd}/`, '')
        if (trimmedFilePath !== 'total') {
          const parts = trimmedFilePath.split('/')
          const fileName = parts.pop()
          const path = parts.join('/')
          const child = { [fileName]: fileData }
          if (!acc[path]) {
            acc[path] = { childs: [cloneDeep(child)], ...fileData }
          } else {
            acc[path].childs.push(cloneDeep(child))
            for (const key in fileData) {
              if (typeof fileData[key] === 'object') {
                acc[path][key] = acc[path][key] || {
                  total: 0,
                  covered: 0,
                  skipped: 0,
                  pct: 0
                }
                acc[path][key].total += fileData[key].total
                acc[path][key].covered += fileData[key].covered
                acc[path][key].skipped += fileData[key].skipped
                acc[path][key].pct =
                  Math.floor(
                    (acc[path][key].covered /
                      (acc[path][key].total - acc[path][key].skipped)) *
                      10000
                  ) / 100
              }
            }
          }
        }
        return acc
      },
      {}
    )
    let compare = 0
    const { test: testMaster } = JSON.parse(process.env.CI_MASTER) || {}
    if (testMaster) {
      const branchesPct = _rslt.total.branches?.pct || 0
      const { coverage } = testMaster
      if (coverage) {
        const originalBranchesPct = coverage ? coverage.branches.pct : 0
        compare = parseFloat((branchesPct - originalBranchesPct).toFixed(2))
      }
    }

    await updateTestRecord(_rslt.total || {}, converage_detail || {}, compare)

    let tableInfo =
      "<table bordercolor='black' border= '2'><thead><tr style = 'background-color : #f9cd0b; color: White'><th>type</th><th>total</th><th>covered</th><th>skipped</th><th>pct</th></tr></thead><tbody>"
    Object.keys(_rslt.total).forEach(v => {
      // v 是分类
      tableInfo += `<tr><td>${v}</td>`
      Object.keys(_rslt.total[v]).forEach(it => {
        tableInfo += `<td>${_rslt.total[v][it]}</td>`
      })
      tableInfo += '</tr>'
    })

    tableInfo += '</tbody></table>'
    await _report(
      `Test coverage: ${
        _rslt.total.branches?.total === 0 ? 'No Test Founded' : ''
      }`,
      `<div>${tableInfo}</div>`
    )

    if (threshold && threshold?.global?.branches) {
      const branchesPct = _rslt.total.branches?.pct
      const ifPass = threshold?.global?.branches < branchesPct
      const extCode = (ifPass ? 0 : 2) * (shouldForce ? 1 : 0)

      process.exit(extCode)
    } else {
      process.exit(0)
    }
  } catch (e) {
    console.log('reportResult error', e)
  }
}

async function getThreshold (prjName) {
  try {
    const result = await request
      .get(`/test/query-config?project=${prjName}`)
      .then(res => res.data)
    return result
  } catch (e) {
    return {
      data: '{}'
    }
  }
}

async function updateTestRecord (coverage, coverage_detail, compare) {
  try {
    if (!disableReport) return
    const { branch, repo } = JSON.parse(process.env.CI)

    const result = await request
      .post('/test/update-detail', {
        branch,
        project: repo,
        coverage: JSON.stringify(coverage),
        coverage_detail: JSON.stringify(coverage_detail),
        compare
      })
      .then(res => res.data)
    const TEST_ENV = {
      coverage,
      compare
    }
    console.log(`TEST_ENV:${JSON.stringify(TEST_ENV)}`)
    console.log(`${repo}统计到单测详情覆盖率:`, result.msg)
    return result
  } catch (e) {
    console.log('update test failed: ', e)
  }
}

async function main (args) {
  const _reusedFiles = await scanFile()

  const jestConfigFromServer = await getThreshold(
    projectAliasMap[ProjectName] || ProjectName
  )
  console.log('jestConfigFromServer', jestConfigFromServer?.data)
  const _coverageThreshold = JSON.parse(
    jestConfigFromServer.data?.threshold || '{}'
  )

  const shouldForce = jestConfigFromServer.data?.force == 1 || false

  userJestConfigFile.collectCoverageFrom =
    userJestConfigFile.collectCoverageFrom || []
  if (userJestConfigFile.coverageReporters) {
    userJestConfigFile.coverageReporters.push(['json-summary'])
  } else {
    userJestConfigFile.coverageReporters = [
      'clover',
      'json',
      'lcov',
      ['json-summary']
    ]
  }
  // userJestConfigFile.reporters = userJestConfigFile.reporters || [] ;
  // userJestConfigFile.reporters.push(path.join(__dirname, '/reporter.js'));
  userJestConfigFile.collectCoverageFrom.unshift(..._reusedFiles)
  if (
    !userJestConfigFile.coverageThreshold &&
    _coverageThreshold.force !== undefined
  ) {
    userJestConfigFile.coverageThreshold = _coverageThreshold
  }
  // userJestConfigFile.coverageReporters = userJestConfigFile.coverageReporters || [];

  if (config.debug) {
    const _toWrite = `
module.exports = ${JSON.stringify(userJestConfigFile, null, 2)};
    `
    // 将内容写入到
    //  execSync(`echo ${_toWrite} > ${path.join(cwd, 'jest.config.debug.js')}`);
    fs.writeFileSync(path.join(cwd, 'jest.config.debug.js'), _toWrite, {
      encoding: 'utf-8'
    })
  }

  if (config.use) {
    const [_c, ...rest] = config.use.split(' ')
    let worker
    const _cfs = userJestConfigFile.collectCoverageFrom.map(v => {
      return `--collectCoverageFrom=${v}`
    })
    const _rpt = userJestConfigFile.coverageReporters.map(v => {
      return `--coverageReporters=${v}`
    })

    const _trld = [
      `--coverageThreshold=${JSON.stringify(
        userJestConfigFile.coverageThreshold
      )}`
    ]

    worker = spawn(_c, [...rest, '--coverage', ..._cfs, ..._rpt, ...args], {
      detached: true,
      stdio: 'inherit'
    })

    worker.on('data', s => {
      console.log(s)
    })

    // worker.stderr.on('data', (err) => {
    //   console.log("=================>>")
    //   console.log(err)
    // });

    worker.on('exit', async code => {
      await reportResult(code, shouldForce, _coverageThreshold)
    })
  }
}

module.exports = main
