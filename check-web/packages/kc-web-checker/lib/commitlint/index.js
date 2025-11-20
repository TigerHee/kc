const { log, reportTask } = require('../utils')
const { sync } = require('conventional-commits-parser')
const checkDependencies = require('./checkDependencies')
const checkWebVersion = require('./checkWebVersion')

module.exports = async (options = { msg: '' }) => {
  try {
    const { depsWereOk, status } = await checkDependencies()
    if (!depsWereOk) {
      process.exit(status)
    } else {
      log.green(`[Success] check dependencies safety: success`)
    }
  } catch (e) {
    log.red(`[Error] check dependencies safety failed: ${e}`)
    process.exit(1)
  }

  try {
    const { checkWebOk } = await checkWebVersion()
    if (!checkWebOk) {
      process.exit(1)
    } else {
      log.green(`[Success] check npm version: success\n`)
    }
  } catch (e) {
    log.red(`[Error] check npm version failed: ${e}\n`)
    process.exit(1)
  }
  if (options.msg.startsWith('Merge')) {
    return
  }
  if (options.msg) {
    const msgParser = sync(options.msg)
    const { type, scope } = msgParser
    if (scope) {
      const task = await reportTask(scope)
      if (!task.data) {
        log.info(`[Info] Commitlint failed:Insight-server network error\n`)
        process.exit(0)
      }
      if (task.data.length > 0) {
        const { status } = task.data[0]
        if (!status) {
          log.red(`[Error] Commitlint failed:TaskId ${scope} status not pass\n`)
          process.exit(1)
        }
      } else {
        log.red(`[Error] Commitlint failed:TaskId ${scope} not found\n`)
        process.exit(1)
      }
    } else {
      log.red(`[Error] Commitlint failed:格式不符合规范，必须包含任务Id\n`)
      process.exit(1)
    }
  }
}
