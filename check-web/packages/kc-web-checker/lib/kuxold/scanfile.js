const child_process = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const { getConfig } = require("./config");

const keywords = "antd|kufox/mui|kc/mui|kc/ui|material-ui|kc/h5ui";

const config = getConfig();

const exec = async (
  _cmdLine,
  logLevel = "silent",
  resolveLogFn = () => {},
  cwd = process.env.PWD
) => {
  return new Promise((resolve) => {
    const child = child_process.exec(
      _cmdLine,
      { cwd },
      (error, stdout, stderr) => {
        resolve({
          error: error,
          data: stdout,
        });
      }
    );
    child.stdout.on("data", (...msg) => {
      if (logLevel !== "silent") {
        console.info(...msg);
      }
      resolveLogFn("[stdout]:", ...msg);
    });
    child.stderr.on("data", (...msg) => {
      if (logLevel !== "silent") {
        console.red(...msg);
      }
      resolveLogFn("[stderr]:", ...msg);
    });
  });
};

// 查询所有的文件
async function getAllFiles() {
  const _config = Object.assign({}, config);
  console.log('config:', _config);
  const filterByName = _config.name
    .split("|")
    .map((v) => {
      return "-name " + `"${v}"`;
    })
    .join(" -o ");

  let _cmdLine = `find ${_config.src} -type ${_config.type} ${filterByName} ;`;

  const files = await exec(_cmdLine);

  return (files.data || "").split("\n");
}

// 读取文件内容
async function readFileContent(filePath) {
  try {
    if (!filePath) {
      return "";
    }
    const fullPath = path.resolve(process.env.PWD, filePath);
    const content = await fs.readFile(fullPath, "utf8");
    return content;
  } catch (error) {
    console.error(`读取文件出错: ${filePath}`, error);
    return "";
  }
}

// 查询指定关键字
async function getFilteredFiles(files) {
  const regex = new RegExp(keywords);
  const filteredFiles = [];

  await Promise.all(
    files.map(async (file) => {
      const content = await readFileContent(file);
      if (regex.test(content)) {
        filteredFiles.push(file);
      }
    })
  );

  return filteredFiles;
}

async function main() {
  const orignalData = await getAllFiles();
  const filteredData = await getFilteredFiles(orignalData);

  return [
    orignalData.filter(Boolean).length,
    filteredData.filter(Boolean).length,
  ];
}

module.exports = main;
