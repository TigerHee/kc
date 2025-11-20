const path = require('path');
const fse = require('fs-extra');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

function lookupFile (dir, file) {
  const fullPath = path.join(dir, file);

  if (fse.existsSync(fullPath) && fse.statSync(fullPath).isFile()) {
    return fse.readFileSync(fullPath, 'utf-8');
  }
}

function loadEnv (envDir, mode) {
  const env = {};
  const envFiles = [
    `.env.${mode}.local`,
    `.env.${mode}`,
    '.env.local',
    '.env'
  ];
  // 按顺序查找 env 文件
  for (const file of envFiles) {
    const envContent = lookupFile(envDir, file);
    if (envContent) {
      const parsed = dotenv.parse(envContent);
      dotenvExpand.expand({
        parsed,
        // 防止 process.env 被覆盖
        ignoreProcessEnv: true
      });

      for (const [key, value] of Object.entries(parsed)) {
        if (env[key] === undefined) {
          env[key] = value;
        }
        if (key === 'NODE_ENV') {
          process.env.NODE_ENV = value;
        }
      }
    }
  }
  return env;
}

module.exports = loadEnv;
