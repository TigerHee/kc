/**
 * Owner: hanx.wei@kupotech.com
 */
const os = require('os');
const oldLangs = require('./langs/old.js');
const { oldToNew, newToOld } = require('./langs/new.json');
const projectConfigs = require('./projects');
const rootDistConfigs = require('./dists');
const { THEME_DEFAULT, THEME_DARK } = require('./themes');
const {
  SERVERLESS_TRIGGER_DEV,
  SERVERLESS_TRIGGER_PRE,
  SERVERLESS_TRIGGER_PRO,
} = require('./constants');
const path = require('path');
const dayjs = require('dayjs');

const isDev = process.env.NODE_ENV === 'development';
// serverEnv pod 注入
const IS_TEST_ENV = /offline/i.test(process.env.serverEnv);
const IS_PRE_ENV = process.env.serverEnv === 'pre';
const IS_PRO_ENV = process.env.serverEnv === 'pro';
// aws serverless 触发
let useServerless = false;
if (IS_PRE_ENV || IS_PRO_ENV || process.env.USE_SERVERLESS) {
  // 预发/生产/dev:aws 开启 serverless 调用
  useServerless = true;
}
const serverlessTrigger = IS_PRO_ENV
  ? SERVERLESS_TRIGGER_PRO
  : IS_PRE_ENV
    ? SERVERLESS_TRIGGER_PRE
    : SERVERLESS_TRIGGER_DEV;

let host = 'https://www.kucoin.com';
let appHost = 'https://www.kucoin.plus';
let cookieDomain = '.kucoin.com';
let appCookieDomain = '.kucoin.plus';
if (IS_TEST_ENV || isDev) {
  const xversion = process.env.xversion || 'nginx-01';
  const TEST_HOSTS = {
    'nginx-01': 'nginx-web-01.sit.kucoin.net',
    'nginx-02': 'nginx-web-02.sit.kucoin.net',
    'nginx-03': 'nginx-web-03.sit.kucoin.net',
    'nginx-04': 'nginx-web-04.sit.kucoin.net',
    'nginx-05': 'nginx-web-05.sit.kucoin.net',
    'nginx-06': 'nginx-web-06.sit.kucoin.net',
    'nginx-07': 'nginx-web-07.sit.kucoin.net',
    'nginx-08': 'nginx-web-08.sit.kucoin.net',
    'nginx-09': 'nginx-web-09.sit.kucoin.net',
    'nginx-10': 'nginx-web-10.sit.kucoin.net',
    'nginx-11': 'nginx-web-11.sit.kucoin.net',
  };
  host = `https://${TEST_HOSTS[xversion]}`;
  appHost = host;
  cookieDomain = '.kucoin.net';
  appCookieDomain = '.kucoin.net';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
let apiHost = host;
if (process.env.USE_LOCAL) {
  const yargs = require('yargs');
  if (yargs.argv.port) {
    host = `http://localhost:${yargs.argv.port}`;
  } else {
    host = 'http://localhost:8000';
  }
  appHost = host;
  cookieDomain = 'localhost';
  appCookieDomain = 'localhost';
  // dev-proxy
  // apiHost = 'http://localhost:2999/next-web';
  // kucoin-base-web
  apiHost = 'http://localhost:8000';
}
// 本地开发 serverless 连 .com
if (isDev && useServerless) {
  host = 'https://www.kucoin.com';
  apiHost = host;
}
const isTest = isDev || IS_TEST_ENV;
const workerCount =
  Number(process.env.WORKER_COUNT) ||
  (IS_TEST_ENV ? 1 : Math.min(os.cpus().length, 21));

module.exports = {
  isDev,
  isTest,
  IS_TEST_ENV,
  IS_PRE_ENV,
  IS_PRO_ENV,
  port: 3001,
  // 同时开启的 worker 数
  workerCount,
  // puppeteer 打开的 page 数
  pageCount: 2,
  host,
  appHost,
  apiHost,
  cookieDomain,
  appCookieDomain,
  // 语言配置在 langs 目录下配置旧的参数，运行 yarn gen-lang 生成新旧语种的映射关系，这里不用修改
  langs: {
    oldLangs,
    newLangs: Object.keys(newToOld),
    oldToNew,
    newToOld,
  },
  testLangs: ['zh-hant', 'en'],
  logPath: isDev
    ? path.resolve(
      process.cwd(),
      `logs/${dayjs().format('YYYY-MM-DD')}-seo-service.log`
    )
    : '/var/log/kucoin/seo-service/node-seo-service-default.log',
  projectConfigs,
  rootDistConfigs,
  robotConfig: {
    // 目前只有线上机器人可用
    chatId: '19:8a77a3527b664d3da1287fa59148507e@thread.v2',
    server:
      'http://internal-96ee79c4-default-msteamsad-1969-193970631.ap-northeast-1.elb.amazonaws.com',
  },
  globalSupportThemes: {
    THEME_DEFAULT,
    THEME_DARK,
  },
  USE_SERVERLESS: useServerless,
  SERVERLESS_TRIGGER: serverlessTrigger,
  SERVERLESS_PROJECTS: ['kucoin-seo-web', 'public-web'],
};
