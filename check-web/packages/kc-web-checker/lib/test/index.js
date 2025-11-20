const { log, genInfoHTML } = require('../utils')
const { spawn } = require('child_process')

module.exports = async () => {
  return new Promise(resolve => {
    if (process.env.npm_package_scripts_test) {
      try {
        const rslt = spawn('yarn', ['test'], {
          env: {
            ...process.env,
            DISABLE_REPORT: false
          }
        })

        let output = ''

        // Listen for data from the child process's stdout
        rslt.stdout.on('data', data => {
          output += data.toString()
          console.log(output)
        })

        // Listen for data from the child process's stderr
        rslt.stderr.on('data', data => {
          output += data.toString()
          console.log(output)
        })
        rslt.on('close', async code => {
          const match = output.match(/TEST_ENV:(.*)/)
          let matchTestEnv = null
          if (match) {
            matchTestEnv = JSON.parse(match[1] || '{}')
          }
          const { compare } = matchTestEnv || {}
          // console.log(matchTestEnv, 'Test')
          const compareStatus = compare && compare < 0
          let compareMsg = ` (compare master: <span style="color: ${
            compareStatus ? 'red' : 'green'
          }">${compare || 0}%</span>)`

          let _exitCode = code
          let msg = ''
          switch (code) {
            case 0: {
              msg = genInfoHTML('test', 'PASS', compare > 0 ? compareMsg : '')
              _exitCode = 0
              break
            }
            case 1: {
              _exitCode = 1
              msg = genInfoHTML('test', 'FAIL', '(单测用例执行失败)')
              break
            }
            case 2: {
              _exitCode = 2
              msg = genInfoHTML('test', 'FAIL', compareStatus ? compareMsg : '')
              break
            }
            case 3: {
              _exitCode = 3
              msg = genInfoHTML(
                'test',
                'PASS',
                '(no errors, not meet the point, force to stop building: true)'
              )
              break
            }
            default: {
              _exitCode = 1
              msg = genInfoHTML('test', 'FAIL')
            }
          }

          return resolve({
            code: _exitCode,
            msg: msg,
            extraData: matchTestEnv
          })
        })
      } catch (e) {
        console.log('test error:', e)
        resolve({
          code: 4,
          msg: genInfoHTML(
            'test',
            'FAIL',
            `(${e.message || 'some error happend'})`
          )
        })
      }
    } else {
      log.info('no npm_package_scripts_test')
      resolve({
        code: 5,
        msg: genInfoHTML('test', 'FAIL', '(no npm_package_scripts_test)')
      })
    }
  })
}
