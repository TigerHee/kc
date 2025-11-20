/**
 * Owner: herin.yao@kupotech.com
 */
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const chalk = require('chalk');

const nonPageFiles = ['_layout.js', 'model.js', 'Context.js'];

/**
 * 扫描页面文件多租户配置——BrandKeys
 * @param {string} dir
 */
function scanBrandKeys(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanBrandKeys(filePath);
    } else if (stat.isFile() && (filePath.endsWith('.js') || filePath.endsWith('.jsx'))) {
      const isPageFile = !nonPageFiles.includes(file);

      const content = fs.readFileSync(filePath, 'utf8');
      const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
      let hasBrandKeys = false;
      ts.forEachChild(sourceFile, function visit(node) {
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'brandCheckHoc') {
          if (node.arguments.length > 1) {
            hasBrandKeys = true;
            const secondArg = content.slice(node.arguments[1].getStart(), node.arguments[1].getEnd());
            const lineAndChar = sourceFile.getLineAndCharacterOfPosition(node.arguments[1].getStart());
            const line = lineAndChar.line + 1;
            const character = lineAndChar.character + 1;
            // fs.appendFileSync('output.txt', `${filePath}: ${secondArg}\n`);
            // 输出`brandCheckHoc`函数第二个参数的内容——即多租户配置
            console.log(`${filePath}:${line}:${character}: ${secondArg}`);
          }
        }
        ts.forEachChild(node, visit);
      });

      if (isPageFile && !hasBrandKeys) {
        // 输出未配置多租户的页面文件路径
        console.log(chalk.yellow(`${filePath}: no brand keys`));
      }
    }
  });
}

scanBrandKeys('src/pages');
