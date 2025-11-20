const fs = require('fs');
const path = require('path');
const { cwd, chdir } = require('process');
const { spawn } = require('node:child_process');

async function publish() {
  console.log('Hi, welcome to publish!');

  try {
    const fReadPath = path.join(cwd(), '.changeset');
    const data = fs.readFileSync(fReadPath);
    const _data = data.toString().split(',');
    const iterator = _data[Symbol.iterator]();
    let currentItem = iterator.next();
    while (!currentItem.done) {
      if (!currentItem.value) {
        currentItem = iterator.next();
      } else {
        chdir(path.join(__dirname, `../packages/${currentItem.value}`));
        const childProcess = spawn('yarn', ['run', 'pub'], {
          stdio: [process.stdin, process.stdout, process.stderr],
        });
        await onExit(childProcess);
        currentItem = iterator.next();

        function onExit(childProcess) {
          return new Promise((resolve, reject) => {
            childProcess.once('exit', (code, signal) => {
              if (code === 0) {
                resolve(undefined);
              } else {
                reject(new Error('Exit with error code: ' + code));
              }
            });
            childProcess.once('error', (err) => {
              reject(err);
            });
          });
        }
      }
    }

    console.log('All release completed!');
  } catch (e) {
    console.log(e.message);
    console.log('Release failed!');
    process.exit(0);
  }
}

publish();
