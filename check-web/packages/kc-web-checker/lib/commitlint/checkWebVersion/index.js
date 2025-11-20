const {
  getProjectCheck,
  projectAliasMap,
  getCheckWebVersion
} = require('../../utils')
const semver = require('semver')
const chalk = require('chalk')

const cwd = process.cwd()
const { dependencies, devDependencies } = require(`${cwd}/package.json`)
const { name: ProjectName } = require(`${cwd}/package.json`)

const checkWebVersion = async () => {
  let checkWebOk = true

  const { data } = await getProjectCheck(
    projectAliasMap[ProjectName] || ProjectName
  )
  if (data) {
    const { data: checkWebData } = await getCheckWebVersion()
    const { check_web_version = '{}' } = checkWebData || {}

    const requiredVersions = JSON.parse(check_web_version)

    for (const [pkg, requiredVersion] of Object.entries(requiredVersions)) {
      const currentVersion = dependencies[pkg] || devDependencies[pkg]

      if (!currentVersion) {
        checkWebOk = false
        console.log(`npm ${chalk.red(pkg)} is not installed.`)
        continue
      }

      // 使用 semver 进行版本比较
      if (semver.lt(semver.coerce(currentVersion), requiredVersion)) {
        console.log(
          ` npm ${chalk.red(pkg)} version ${chalk.red(
            currentVersion
          )} is lower than required ${chalk.yellow(requiredVersion)}.`
        )
        checkWebOk = false
      }
    }
  }

  return { checkWebOk }
}
module.exports = checkWebVersion
