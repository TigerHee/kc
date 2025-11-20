/**
 * Owner: hanx.wei@kupotech.com
 */
const cp = require('child_process');
const util = require('util');
const exec = util.promisify(cp.exec);

function execSync(cmd, options = {}) {
  const result = { err: null, stderr: null, res: '' };
  try {
    result.res = cp.execSync(cmd, {
      stdio: [ 'ignore', 'ignore', 'pipe' ],
      ...options,
    })?.toString();
  } catch (err) {
    result.err = err;
    if (err.stderr) {
      result.stderr = err.stderr;
    }
    // console.log(err.stderr ? err.stderr.toString() : err);
  }
  return result;
}

async function execAsync(cmd) {
  const result = { err: null, res: '' };
  try {
    const { stdout, stderr } = await exec(cmd);
    if (stderr) {
      console.log('stderr:', stderr);
      result.err = stderr;
    } else {
      result.res = stdout;
    }
  } catch (err) {
    console.log(err);
    result.err = err;
  }
  return result;
}

exports.promisifyExec = exec;
exports.execSync = execSync;
exports.execAsync = execAsync;
