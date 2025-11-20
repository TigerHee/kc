/**
 * Owner: roger.chen@kupotech.com
 */
// 监听models目录所有model文件
// 自动注入到_index.js
// 新增文件需重启服务
// 暂不支持目录嵌套

const path = require('path');
const fs = require('fs');
const projectPath = path.join(__dirname, '../../');
const modelsPath = path.join(projectPath, 'src/models');
let keys = [];

// 根据文件名获取对应key
function getKeyByFileName(fileName) {
  return fileName.replace(/\.js$/g, '').replace(/\./g, '_');
}

// 注册逻辑
function register() {
  keys = [];
  const data = fs.readdirSync(modelsPath);
  let outputScript =
    '// 此文件为脚本自动生成，手动编辑无效\n// 此文件为脚本自动生成，手动编辑无效\n// 此文件为脚本自动生成，手动编辑无效\n';
  data.forEach(item => {
    if (/.*.js$/.test(item) && item !== '_index.js') {
      const key = getKeyByFileName(item);
      keys.push(key);
      outputScript += `import _${key} from './${item}';\n`;
    }
  });
  if (keys.length) {
    outputScript += '\n';
    keys.forEach(item => {
      outputScript += `export const ${item} = _${item};\n`;
    });
    console.log(`model自动注册成功，共计${keys.length}个`);
    fs.writeFileSync(path.join(modelsPath, '_index.js'), outputScript, 'utf8');
  }
}

register();
