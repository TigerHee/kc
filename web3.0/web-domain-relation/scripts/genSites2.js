/**
 *  流程：
 *
 *  1、尝试获取定制的模版，如果没有，则采用基础模版， 模版名： www.kucoin.xxx; m.kucoin.xxx; m.pool-x.xxx
 *  2、处理基础模版中的变量，
 *  3、生成对应的文件
 *
 *  dev 的都直接拷贝，不处理，
 *
 *
 */

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const execCmd = require("child_process").exec;
const TLDs = ["center", "com", "io","biz", "cc", "top", "cloud","net"];
const TldCN = 'center';

// 测试环境的主站地址，默认是default， 如果需要指定某个域名文件的主站地址
// [想要修改的站点]: 【定制的主战地址】
// 如 "land.kucoin.net": "v3.kucoin.cc"
const qaMainHost = {
  // 默认 v2.kucoin.net 为测试环境的main_host
  default: "www.kucoin.net",

  // 使用 www.kucoin.net 作为测试环境主域名的站点
  "www.kucoin.net": "www.kucoin.net",
};


let allSites = [];
// 获取所有的配置文件， 并根据路径判断是否是子

main();

async function main() {
  // 处理kc 相关
  const kcSites = await getConfigs("../tpls");
  console.log('geting all kc sites configs...');
  console.log(chalk.blue(`---${allSites.join('\n---')}`));

  console.log(chalk.green('start to resolve site'));
  await loopDomain(TLDs, kcSites);



  // 处理km 相关
  console.log('geting all km sites configs...');
  const kmSites = await getConfigs("../tpls/futures");
  console.log(chalk.blue(`---${allSites.join('\n---')}`));

  // console.log('kmSites', kmSites);
  await loopDomain(TLDs, kmSites, '/futures');

  console.log('all is done');
}

async function loopDomain(tlds, sites, sub = "") {
  const [tld, ...restTlds] = tlds;

  if (tld) {
    console.log(chalk.green(`resolve domain: ${tld}`))
    await loop(sites, tld, sub);
  }
  if (restTlds.length) {
    await loopDomain(restTlds, sites, sub);
  }
}

async function loop(sites, tld, sub = "") {
  const [site, ...restSites] = sites;
  if (site) {
    const _tplContent = await resolveTpl(site, tld, sub);
    if(_tplContent) {
      const fileName = site.replace('xxx', tld) + '.js';
      const _filePath = path.join(__dirname, '../sites/', path.join(sub, fileName));
      // console.log(_filePath);
      await writeFile(_filePath, _tplContent);
      console.log('done ======>>>', fileName)
    }
  }
  if (restSites.length) {
    await loop(restSites, tld, sub);
  }
}

async function resolveTpl(site, tld, sub) {
  const targetSite = site.replace(".xxx", `.${tld}`);
  console.log('resolve site: ', targetSite);
  let ifExistExactConfig = allSites.some(v => v === targetSite);

  const tpl = await getConfigForSite(targetSite, sub);
  if(!tpl) {
    return null;
  }
  // 如果明确提供了某个模板，那么直接返回该模板, 不再做其他处理
  if(ifExistExactConfig && tpl) {
    return tpl;
  }
  let result = tpl.toString();
  result = result
    .replace(/\{tld\}/g, tld)
    .replace(/\{tldCN\}/g, tld === 'com' ? TldCN : tld)
    .replace(/\{entry\}/g, site.replace(".xxx", ""));

  // net 由于与规则不符合，故需要重新处理
  const curSite = site.replace(/xxx/, tld);

  if (tld === "net") {
    const _main = `https://${qaMainHost[curSite] || qaMainHost.default}`;
    // 处理测试环境是v2.kucoin.net 的问题
    result = result.replace(/https\:\/\/www\.kucoin\.net/g, _main);
    // 处理poolx 的不一致问题
    result = result.replace(/pool-x\.io/g, 'pool-x.net');
  }
  return result;
  // return JSON.parse(result);
}

/**
 * 读取文件夹，获取sites 列表
 *
 * @param   {[type]}  relativePath  [相对文件夹路径]
 *
 * @return  {[type]}                [return description]
 */
async function getConfigs(relativePath) {
  const tplFolder = path.join(__dirname, relativePath);
  const { data } = await exec(`ls ${tplFolder}`);
  const sites = data
    .split("\n")
    .filter((v) => !!v && /\.js/.test(v))
    .map((v) => v.replace(".js", ""));
  allSites = [...sites];
  return Array.from(new Set(sites.map((v) => v.replace(/\.([^.]+)$/, ".xxx"))));
}

// 获取文件配置，优先级 www.kucoin.com > www.kucoin.xxx;
async function getConfigForSite(site, sub) {
  // console.log("get config for site", site);
  let _tpl = null;
  let _tplPath = path.join(__dirname, "../tpls", sub, site + ".js");

  const defaultSiteName = site.replace(/\.([^.]+)$/, ".xxx");

  const defaultPath = path.join(
    __dirname,
    "../tpls",
    sub,
    defaultSiteName + ".js"
  );

  const isXXXNotExit = await checkIfFileExit(defaultPath);
  let _tlpTmp = '';
  // 如果是通用域名获取，那么直接读取对应的文件
  if (!/\.xxx/.test(site)) {
    try {
      // _tpl = require(_tplPath);
      const {err, data} = await readFile(_tplPath);
      if(err) {
        throw err;
      }
      _tlpTmp = data;
    } catch (e) {
      if(!isXXXNotExit) {
        const {err, data} = await readFile(defaultPath);
        _tlpTmp = data;
        // _tpl = require(defaultPath);
      }
    }
    // return _tlpTmp;
  } else {
    if(!isXXXNotExit) {
      const {err, data} = await readFile(defaultPath);
      _tlpTmp = data;
      // _tpl = require(defaultPath);
    }
    // return _tlpTmp || null;
  }
  return _tlpTmp || null;

}

async function exec(cmdLine) {
  return new Promise((resolve) => {
    execCmd(cmdLine, (err, data) => {
      resolve({
        err: err || null,
        data: data || null,
      });
    });
  });
}

async function checkIfFileExit(filePath) {
  const { err, data } = await exec(`ls ${filePath}`);
  return !!err && (data || '').indexOf('No Such') === -1;
}


async function writeFile(filepath, content) {
  return new Promise((resolve) => {
    fs.writeFile(filepath, content, (err) => {
      if(!err) {
        resolve({ err: null });
      } else {
        resolve({ err });
      }
    })
  })
}


async function readFile(filepath) {
  return new Promise((resolve) => {
    fs.readFile(filepath, (err, stdout) => {
      if(!err) {
        resolve({ err: null, data: stdout });
      } else {
        resolve({ err, data: null });
      }
    })
  })
}
