// rollup-plugin-normal-module-replacement.js
const path = require('path');

module.exports = function normalModuleReplacementPlugin() {
  return {
    name: 'normal-module-replacement',
    
    resolveId(source, importer) {
      // 只处理 @kux/mui-next 相关的模块
      if (source.match(/^@kux\/mui-next/)) {
        // 检查是否包含 /use 路径（hooks）
        if (source.match(/\/use/)) {
          // 提取 hook 名称
          const hookMatch = source.match(/@kux\/mui-next\/(use\w+)/);
          if (hookMatch) {
            const hookName = hookMatch[1];
            // 使用绝对路径
            const absolutePath = path.resolve(__dirname, '../node_modules/@kux/mui-next/hooks', `${hookName}.js`);
            // console.log(`Replacing '${source}' with '${absolutePath}' in '${importer}'`);
            return absolutePath;
          }
        }
      }
      return null; // 让其他插件处理
    }
  };
};