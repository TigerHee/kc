/*
 * @owner: borden@kupotech.com
 */
const fs = require('fs');
const path = require('path');

const WHITE_LIST = [];
const { PASS_PCT } = process.env;

function countUncoveredTestFiles() {
  const sourcePath = path.join(__dirname, '../unused-files.json');
  const destPath = path.join(__dirname, '../coverage', 'unused-files.json');
  // 1. 将unused-files.json文件移入coverage文件夹中
  try {
    fs.renameSync(sourcePath, destPath);
    console.log("unused-files.json has been moved to the coverage directory.");
  } catch (err) {
    console.error("Error: ", err);
  }
  // 2. 读取coverage-summary.json文件
  const coverageSummaryPath = path.join(__dirname, '../coverage', 'coverage-summary.json');
  const coverageSummaryData = fs.readFileSync(coverageSummaryPath, 'utf8');
  const obj = JSON.parse(coverageSummaryData);

  // 3. 读取unused-files.json文件
  let arr;
  try {
    const unusedFilesPath = path.join(__dirname, '../coverage', 'unused-files.json');
    const unusedFilesData = fs.readFileSync(unusedFilesPath, 'utf8');
    arr = JSON.parse(unusedFilesData);
  } catch (e) {
    arr = [];
  }

  // 4. 获取结果
  const result = {
    canExcludeFiles: [], // 可以排除在统计外的文件(未使用文件)
    uncoveredTestFiles: {}, // 待提高覆盖率的文件
  };

  // 遍历obj对象
  for (let key in obj) {
    const { pct } = obj[key].branches;
    if (key !== 'total' && pct < PASS_PCT && !WHITE_LIST.includes(key)) {
      const filePath = key.replace(/.*\/trade-web\/src\//, 'src/');
      if (arr.includes(key)) {
        result.canExcludeFiles.push(filePath);
      } else {
        result.uncoveredTestFiles[filePath] = pct;
      }
    }
  }

  // 5. 将result写入一个coverage文件夹下的uncoveredTestFiles.json文件中
  const resultPath = path.join(__dirname, '../coverage', 'uncoveredTestFiles.json');
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 4), 'utf8');

  console.log('completed uncoveredTestFiles.json.');
}

countUncoveredTestFiles();
