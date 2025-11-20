const fs = require('fs');
const path = require('path');

function getDirectorySize(directory, callback) {
  fs.readdir(directory, (err, files) => {
    if (err) return callback(err);

    let count = files.length;
    let total = 0;

    if (count === 0) return callback(null, 0);

    files.forEach((file) => {
      const filePath = path.join(directory, file);

      fs.stat(filePath, (err, stat) => {
        if (err) return callback(err);

        if (!stat.isDirectory()) {
          total += stat.size;
        }

        count--;

        if (count === 0) {
          callback(null, total);
        }
      });
    });
  });
}

function scanDirectory(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('Could not list the directory.', err);
      process.exit(1);
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);

      fs.stat(filePath, (err, stat) => {
        if (err) {
          console.error('Error stating file.', err);
          return;
        }

        if (stat.isDirectory()) {
          getDirectorySize(filePath, (err, size) => {
            if (err) {
              console.error('Error getting directory size.', err);
              return;
            }

            const sizeInKB = size / 1024;
            console.log(`Directory: ${filePath} Size: ${sizeInKB.toFixed(2)} KB`);
          });
        }
      });
    });
  });
}

scanDirectory('./lib');
