const git = require('simple-git');
const fs = require('fs');
const chalk = require('chalk');

module.exports = async ({ limit = 150, path, exclude }) => {
  console.log('Check Path: ', path);
  git().status((err, status) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  
    status.files.forEach(file => {
      // 如果文件状态为"deleted"，则跳过
      if (file.index === 'D' || file.working_dir === 'D') {
        return;
      }
      // 如果文件路径包含排除的字符串，也跳过
      if (exclude.some(excludeString => file.path.includes(excludeString))) {
        return;
      }
      path.forEach((p) => {
        if (file.path.startsWith(p)) {
          fs.stat(file.path, (err, stats) => {
            if (err) {
              console.log(err);
              process.exit(1);
            }
    
            const fileSizeInKilobytes = stats.size / 1024;
            if (fileSizeInKilobytes > limit) {
              console.log(chalk.red(`File ${file.path} is too large (${fileSizeInKilobytes}KB), limited to ${limit}KB or less. Aborting commit.`));
              process.exit(1);
            }
          });
        }
      })
    });
  });
}

