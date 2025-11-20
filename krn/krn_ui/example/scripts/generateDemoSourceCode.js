/**
 * Owner: willen@kupotech.com
 */
const path = require("path");
const fs = require("fs");
const projectPath = path.join(__dirname, "../../");

function init() {
  (function loop(MyPath) {
    try {
      const dirs = fs.readdirSync(MyPath);
      dirs.forEach((item) => {
        // 检测是目录还是文件
        if (/\.\w+$/.test(item)) {
          // 支持的后缀格式
          if (/.*\.js$/.test(item) && !item.includes(".doc.js")) {
            const fullPath = path.join(MyPath, item);
            const fileDir = path.dirname(fullPath);
            const fileName = path.basename(fullPath, ".js");
            let fullString = fs.readFileSync(fullPath, "utf8");
            fullString = fullString.replace(/`/g, "\\`");
            fs.writeFileSync(
              path.join(fileDir, `${fileName}.doc.js`),
              `export default \`${fullString}\`;`,
              "utf8"
            );
          }
        } else {
          loop(path.join(MyPath, item));
        }
      });
    } catch (e) {
      console.log(e);
    }
  })(path.join(projectPath, "example/src/demos"));
}

init();
