// 把 public 目录下的文件复制到 dist 目录下
const { name, version } = require("../package.json");
const fs = require("fs");
const path = require("path");

const publicDir = path.resolve(__dirname, "../public");
const distDir = path.resolve(__dirname, "../dist", name, version);

// 递归复制文件和目录的函数
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    // 如果是目录，先创建目标目录，然后递归复制内容
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((file) => {
      const srcPath = path.resolve(src, file);
      const destPath = path.resolve(dest, file);
      copyRecursive(srcPath, destPath);
    });
  } else if (stat.isFile()) {
    // 如果是文件，直接复制
    fs.copyFileSync(src, dest);
  }
}

// 确保目标目录存在
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 复制 public 目录下的所有内容
fs.readdirSync(publicDir).forEach((file) => {
  const srcPath = path.resolve(publicDir, file);
  const destPath = path.resolve(distDir, file);
  copyRecursive(srcPath, destPath);
});

console.log(`已成功复制 public 目录到 ${distDir}`);
