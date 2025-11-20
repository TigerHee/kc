import * as fs from 'fs';
import * as path from 'path';
import { writeMiscInfo, ROOT_DIR } from './intermediate-misc';

const execCmd = require('child_process').exec;

/**
 * 对需要发包的package进行打包操作
 * 根目录执行默认的pnpm run build，会所有包都进行build
 */
async function packageBuild() {
  try {
    writeMiscInfo({ skipPostBuild: true });
    const fReadPath = path.join(ROOT_DIR, '.publish-packages');
    const data = fs.readFileSync(fReadPath);
    const packages = data.toString().split(',').filter(packageName => !!packageName);
    const filterParams = packages.map(packageName => `--filter=./packages/${packageName}`).join(' ');
    const cmdContent = `pnpm run build ${filterParams}`
    console.log('exec cmd:', cmdContent);
    execCmdLine(cmdContent);
  } catch (e) {
    console.log(e.message);
    console.log('build failed!');
    process.exit(0);
  }
}

async function execCmdLine(cmdLine) {
  return new Promise((resolve, reject) => {
    execCmd(cmdLine, (err, stdout) => {
      if (err) {
        console.error(err);
        reject(new Error(`Command "${cmdLine}" failed: ${err.message}`));
      } else {
        stdout && console.log(stdout);
        resolve({error: err, data: stdout});
      }
    });
  });
}

packageBuild();
