import * as fs from 'fs';
import * as path from 'path';
import { chdir } from 'process';
import { spawn } from 'node:child_process';
import { ROOT_DIR } from './intermediate-misc';

/**
 * 读取 .publish-packages， 并执行对应包内的 release 命令
 * 需要前置对应该包，先执行 run build 打包后，才能正常执行 release 发包操作
 */
async function publish() {
  console.log('Hi, welcome to publish!');

  try {
    const fReadPath = path.join(ROOT_DIR, '.publish-packages');
    const data = fs.readFileSync(fReadPath, 'utf-8');
    const items = data.split(',')
      .map(item => item.trim()).filter(item => !!item);

    let errorCount = 0;
    for (const pkgName of items) {
      chdir(path.join(__dirname, `../packages/${pkgName}`));
        const childProcess = spawn('pnpm', ['run', 'release'], {
          stdio: [process.stdin, process.stdout, process.stderr]
        });
        try {
          await onExit(childProcess);
          console.log(`Release completed for ${pkgName}`);
        } catch (error) {
          console.error(`Release failed for ${pkgName}`);
          errorCount++;
        }
    }
    if (errorCount === items.length) {
      throw new Error("All packages release failed!");
    }
    console.log('All release completed!');
  } catch (e) {
    console.log(e.message);
    console.log('Release failed!');
    process.exit(1);
  }
}

function getPkgVersion(pkgName: string) {
  const pkgPath = path.join(ROOT_DIR, `packages/${pkgName}/package.json`);
  if (fs.existsSync(pkgPath)) {
    const pkg = require(pkgPath);
    return pkg.version;
  }
  return '0.0.0';
}

function onExit(childProcess) {
  return new Promise((resolve, reject) => {
    childProcess.once('exit', (code, signal) => {
      if (code === 0) {
        resolve(undefined);
      } else {
        reject(new Error('Exit with error code: '+code));
      }
    })
    childProcess.once('error', (err) => {
      reject(err);
    })
  })
}

publish();
