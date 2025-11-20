
const LottieCompress = require('lottie-compress')
const fs = require('fs');
const path = require('path');

/**
 * 压缩 srcFile 文件，并将结果写入 destFile 文件
 * @param {string} srcFile lottie json 源文件路径
 * @param {string} destFile lottie json 压缩后文件路径
 */
async function compressLottie(srcFile, destFile) {
  const data = fs.readFileSync(srcFile, 'utf8');
  const lottieCompress = new LottieCompress.default(data)
  const ret = await lottieCompress.execute();
  fs.writeFileSync(destFile, JSON.stringify(ret), 'utf8');
  console.log(`lottie compress success: ${srcFile} -> ${destFile}`);
}

/**
 * 读取目录下的所有JSON文件(未递归)
 * @param {string} dirname
 * @returns {string[]}
 */
function readFiles(dir) {
  return fs.readdirSync(dir)
    .map(filename => path.join(dir, filename))
    .filter(filename => /.json$/.test(filename) && fs.statSync(filename).isFile());
}

/**
 * 压缩dir目录下的所有lottie文件并覆盖原文件
 * @param {string[]} dir
 */
async function compressLottieFiles(dirs) {
  const files = dirs.map((dir) => readFiles(path.resolve(__dirname, dir))).flat(Infinity);

  for (let index = 0; index < files.length; index++) {
    const filePath = files[index];
    await compressLottie(filePath, filePath);
  }
}

// 需要优化哪个目录就往这个数组里加路径
compressLottieFiles([`../src/assets/annual-bill/lotties`, `../src/assets/annual-bill/lotties`]);
