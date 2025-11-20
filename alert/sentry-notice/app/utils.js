const child_process = require("child_process");

async function exec(cmdLine) {
  return new Promise((resolve, reject) => {
    const cmdProcess = child_process.exec(
      cmdLine,
      { stdio: "inherit" },
      (err, stdout) => {
        if (err) {
          reject({
            error: err,
            data: null,
          });
        } else {
          resolve({
            error: err,
            data: stdout || null,
          });
        }
      }
    );
    // 消费掉，避免出现溢出
    cmdProcess.stdout.on("data", (data) => {
      resolve(data);
    });

    cmdProcess.stderr.on("data", (err) => {
      if (err && err.error) {
        reject(err);
      }
    });
  });
}

module.exports = exec;
