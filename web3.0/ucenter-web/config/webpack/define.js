import _ from 'lodash';
import path from 'path';
import pkg from '../../package.json';

require('dotenv').config({ path: path.resolve(__dirname, '../.xversion') });
const { XVersion, Desc } = process.env;

const isDev = process.env.NODE_ENV === 'development';
const isSit = process.env.APP_CDN === 'https://assets-v2.kucoin.net';
const isProd = process.env.NODE_ENV === 'production' && !isSit;

const _APP_ = `${pkg.name}_${pkg.version}`;

export default {
  _XVERSION_: _.isEmpty(XVersion) ? undefined : XVersion,
  _DESC_: _.isEmpty(Desc) ? undefined : Desc,
  _DEV_: isDev,
  _APP_NAME_: pkg.name,
  _VERSION_: pkg.version,
  _APP_,
  SENTRY_DEBUG: false,
  IS_INSIDE_WEB: false,
  IS_SANDBOX: false,
  CHARTING_PATH: isDev ? '/charting_library_master/' : '/kucoin-base-web/charting_library_master/',
  _PUBLIC_PATH_: isDev ? '/' : `https://assets.staticimg.com/${pkg.name}/${pkg.version}/`,
  DEPLOY_PATH: `${pkg.name}/${pkg.version}`,
  _VERSION_PATH_: isDev ? '/' : `https://assets.staticimg.com/${pkg.name}/`,
  CMS_CDN: 'https://assets.staticimg.com/cms-static',
  _ENV_: isProd ? 'prod' : isDev ? 'dev' : 'sit',
};
