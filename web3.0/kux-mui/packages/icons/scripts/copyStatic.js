const fs = require('fs');
const path = require('path');

const resolvePath = (url) => path.resolve(__dirname, url);

function copyFolder(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  const items = fs.readdirSync(src);

  items.forEach((item) => {
    const oldPath = path.join(src, item);
    const newPath = path.join(dest, item);

    if (fs.statSync(oldPath).isDirectory()) {
      copyFolder(oldPath, newPath);
    } else {
      fs.copyFileSync(oldPath, newPath);
    }
  });
}

copyFolder(resolvePath('../static'), resolvePath('../lib/static'));
