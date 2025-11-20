const fs = require('fs');
const path = require('path');

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];
const arr = [];
const arrUsed = [];
function getImagesSize(directory) {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile() && isImage(file)) {
      if (stats.size / 1024 > 100) {
        arr.push({ file: filePath, size: stats.size });
      }
    } else if (stats.isDirectory()) {
      getImagesSize(filePath);
    }
  });
}
function isImage(filename) {
  const ext = path.extname(filename).toLowerCase();
  return imageExtensions.includes(ext);
}

function checkFileContent(filePath) {
  const data = fs.readFileSync(filePath);
  arr.forEach((file) => {
    const _file = file.file.split('cdnAssets/')[1];
    if (data.includes(_file)) {
      arrUsed.push({ file: file.file, size: file.size, page: filePath });
    } else {
      arrUsed.push({ file: file.file, size: file.size, page: 'unused' });
    }
  });
}
function traverseDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      checkFileContent(filePath);
    } else if (stats.isDirectory()) {
      traverseDirectory(filePath);
    }
  });
}

function writeTohtml() {
  const htmls = `<table>
        <thead>
           <tr>
             <th style="text-align:left">file</th>
             <th>size (KB)</th>
             <th>path in use</th>
          </tr>
        </thead>
        <tbody>
            ${arrUsed
              .sort((a, b) => b.size - a.size)
              .map(
                (item) => `
              <tr style="${item.size / 1024 > 100 ? 'color:red;' : 'color:gray;'}">
                <td>${item.file}</td>
                <td>${item.size / 1024}</td>
                <td>${item.page}</td>
              </tr>
            `,
              )}
        </tbody>
    </table>
  `;
  fs.writeFile('./scanedImg.html', htmls, (err) => {
    if (err) {
      console.log('generate scaned html failed.');
    }
  });
}

const directory = './cdnAssets';
const sourceDir = './src';

getImagesSize(directory);
traverseDirectory(sourceDir);
writeTohtml();
