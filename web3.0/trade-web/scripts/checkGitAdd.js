/**
 * 检查各个项目对base 的依赖，根据需要进行更新
 * runtime: node
 */
const { exec } = require('child_process');

const cwd = process.cwd();

function runGitGrep() {
  return new Promise((resolve, reject) => {
    const childProcess = exec(
      "git status |grep -E 'Changes not staged for commit|Untracked files'",
      { cwd },
    );
    childProcess.on('exit', (code) => {
      if (code === 0) { // 找到
        reject();
      } else { // 未找到
        resolve();
      }
    });
    childProcess.stdout.on('data', (data) => {
      if (data.trim() !== '') {
        console.log(`[childProcess data] pid:${childProcess.pid} data:`);
        console.log(`stdout:\n${data}`);
      }
    });
    childProcess.stderr.on('data', (data) => {
      if (data.trim() !== '') {
        console.log(`[childProcess error] pid:${childProcess.pid} data:`);
        console.log(`stderr:\n${data}`);
      }
    });
  });
}

async function main() {
  runGitGrep()
    .then(() => {
      console.log('[attention]: check git add success');
      process.exit(0);
    })
    .catch(() => {
      console.log('[attention]: check your git status');
      process.exit(1);
    });
}

// run
main();
