/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-11-13 10:35:06
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-11-14 15:03:54
 * @FilePath: /trade-web/config/define.js
 * @Description:
 */
/**
 * Owner: garuda@kupotech.com
 * 定义全局可使用的公共变量
 */
const path = require('path');
const configs = require('./variable');
require('dotenv').config({ path: path.resolve(__dirname, '../.xversion') });

const { XVersion = '', Desc = '' } = process.env;
const { version, name, isProd, isTest, siteCfg, site } = configs;

// site-sdb开头的为沙盒
// production下 dev/sit/sdb 使用/_cdn路径转发，生产线上使用CDNHOST
// const msite = site || '';
// const IS_SANDBOX = msite.indexOf('site-sdb') === 0;
// const IS_INSIDE_WEB = msite === 'site-cn';
// const IS_TEST_ENV = msite.indexOf('sit') === 0 && msite.indexOf('site') < 0;
// let cdnHost = 'https://assets.staticimg.com';
// if (msite.indexOf('dev') === 0 || IS_TEST_ENV || IS_SANDBOX) {
//   cdnHost = '/_cdn';
// }
const cdnHost = 'https://assets.staticimg.com';

// webpack5 打包是运行时注入的 __webpack_public_path__ 不能在这里静态使用 只能写死
const publicPath = isProd
  ? `${cdnHost}/${name}/${version}/`
  : 'http://localhost:8100/';

const natashaPath = 'https://assets.staticimg.com/natasha/npm';

module.exports = {
  _DEV_: !isProd,
  _PRD_: isProd,
  _IS_SANDBOX_: false,
  _PUBLIC_PATH_: publicPath,
  _NATASHA_PATH_: natashaPath,
  _APP_NAME_: name,
  _VERSION_: version,
  _SITE_: site,
  _RELEASE_: `${name}_${version}`,
  _API_HOST_: siteCfg['API_HOST.WEB'],
  _GATE_WAY_: siteCfg['API_HOST.WEB'],
  _IS_TEST_: isTest,
  // _IS_INSIDE_WEB_: IS_INSIDE_WEB,
  _RUNTIME_CONFIG_: configs,
  _XVERSION_: XVersion ? undefined : XVersion,
  _DESC_: Desc ? undefined : Desc,
  CHARTING_PATH: !isProd
    ? '/charting_library_1.14/'
    : '/kucoin-base-web/charting_library_1.14/',
  SENTRY_DEBUG: true,
  LOCAL_SENTRY_DEBUG: false,
};
