
const { log, spawn, genInfoHTML } = require('../utils');

module.exports = async () => {
    if (process.env.npm_package_scripts_lint) {

        const result = await spawn('yarn', ['lint']);
        if (result.code !== 0) {
            log.red('[Error] Eslint check failed:\n');
            return {
                code: 1,
                msg: genInfoHTML('eslint', 'FAIL')
            }
        }
        return {
            code: 0,
            msg: genInfoHTML('eslint', 'PASS')
        }
        // await reportWithBuildInfo('Eslint check success')
    }else{
        log.info('no npm_package_scripts_lint')
        return {
            code: 1,
            msg: genInfoHTML('eslint', 'FAIL', "(no npm_package_scripts_lint)")
        }
    }
}
