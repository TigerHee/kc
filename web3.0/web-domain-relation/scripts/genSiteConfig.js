const fs = require("fs");
const path = require("path");

// 递归遍历目录，找到所有的 siteConfig.json 文件
const findSiteConfigFiles = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(findSiteConfigFiles(filePath));
    } else if (file === "siteConfig.json") {
      results.push(filePath);
    }
  });

  return results;
};

const genSiteConfig = () => {
  const srcPath = path.resolve(__dirname, "./src");
  const siteConfigFiles = findSiteConfigFiles(srcPath);

  siteConfigFiles.forEach((siteConfigPath) => {
    const siteConfig = JSON.parse(fs.readFileSync(siteConfigPath, "utf-8"));

    // 转换 functions 和 bizConfigs 数组为对象格式
    siteConfig.functions = siteConfig.functions.reduce((acc, item) => {
      acc[item.code] = item.value;
      return acc;
    }, {});

    siteConfig.bizConfigs = siteConfig.bizConfigs.reduce((acc, item) => {
      acc[item.code] = item.value;
      return acc;
    }, {});

    // 构建新的内容
    const content = `
// this file is generate by genSiteConfig for rollup
// don't edit this file
window._SITE_CONFIG_ = ${JSON.stringify(siteConfig, null, 2)};
`;

    // 删除原来的 siteConfig.js 文件
    const jsFilePath = path.join(path.dirname(siteConfigPath), "siteConfig.js");
    if (fs.existsSync(jsFilePath)) {
      fs.unlinkSync(jsFilePath);
    }

    // 写入新的 siteConfig.js 文件
    fs.writeFileSync(jsFilePath, content);
  });
};

export { genSiteConfig };
