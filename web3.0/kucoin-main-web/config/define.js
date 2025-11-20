import _ from 'lodash';
import path from 'path';
import { isProd, isDev, isSit } from './env';
import pkg from '../package.json';

require('dotenv').config({ path: path.resolve(__dirname, '../.xversion') });
const { XVersion, Desc } = process.env;

const _APP_ = `${pkg.name}_${pkg.version}`;

const site = isDev ? 'dev' : isSit ? 'sit' : 'site';

export default {
  _XVERSION_: _.isEmpty(XVersion) ? undefined : XVersion,
  _DESC_: _.isEmpty(Desc) ? undefined : Desc,
  _DEV_: isDev,
  _APP_NAME_: pkg.name,
  _VERSION_: pkg.version,
  _SITE_: site,
  _APP_,
  SENTRY_DEBUG: false,
  IS_INSIDE_WEB: false,
  IS_TEST_ENV: isSit,
  IS_SANDBOX: false,
  CHARTING_PATH: isDev ? '/charting_library_master/' : '/kucoin-base-web/charting_library_master/',
  _PUBLIC_PATH_: isDev ? '/' : `https://assets.staticimg.com/${pkg.name}/${pkg.version}/`,
  DEPLOY_PATH: `${pkg.name}/${pkg.version}`,
  _VERSION_PATH_: isDev ? '/' : `https://assets.staticimg.com/${pkg.name}/`,
  CMS_CDN: 'https://assets.staticimg.com/cms-static',
  _ENV_: isProd ? 'prod' : isDev ? 'dev' : 'sit',
};
