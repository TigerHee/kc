const axios = require("axios");
const zlib = require("zlib");
const fs = require("fs");
const path = require("path");
const https = require("https");
const { getBuildInfo } = require("../utils");

// 规范平台 上传stats.json
const uploadStatsToInsight = async (reportHtmlPath, isDev) => {
  let host = "https://insight.kcprd.com/api";
  if (isDev) {
    host = "http://localhost:3030";
  }
  const { branch, project } = getBuildInfo();

  // 如果不是测试环境，那么不进行 上传
  if (!branch || /^feature/.test(branch)) {
    return;
  }
  //读取原始 JSON 文件的内容
  const reportHtml = fs.readFileSync(reportHtmlPath, "utf8");
  const reportGzip = zlib.gzipSync(reportHtml);

  try {
    // 将文件内容转换为数据 URI 格式
    const distData = {
      uri: reportGzip,
      repo: project,
      branch,
    };
    // 发送请求
    await axios.post(`${host}/stats`, distData, {
      timeout: 10000,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    console.log("report.html uploaded successfully:");
  } catch (error) {
    console.error("Error uploading report.html:", error.message || error);
    return;
  }
};

module.exports = async () => {
  const reportHtmlPath = path.join(process.env.PWD, "dist", "report.html");

  // 检查文件是否存在并上传
  if (!fs.existsSync(reportHtmlPath)) {
    console.log("dist/report.html file not found,stop build analyzer");
    return;
  }
  await uploadStatsToInsight(reportHtmlPath);
  // 删除dist/report.html
  fs.unlink(reportHtmlPath, (err) => {
    if (err) {
      console.error("Error deleting the report file:", err);
      process.exit(1);
    } else {
      console.log("Report file deleted successfully from dist directory.");
    }
  });
};
