/* eslint-disable @typescript-eslint/no-require-imports */
const { version, name } = require('./package.json');
const { version: gbizVersion } = require('gbiz-next/package.json');
const { IS_SPA_MODE, IS_DEV, IS_SERVER_ENV } = require('kc-next/env');

const port = process.env.PORT || '3000';
const cdnPrefix = process.env.NEXT_PUBLIC_CDN_PREFIX;

const assetPrefix = !IS_DEV
  ? `${cdnPrefix}/${name}/${version}/${IS_SPA_MODE ? 'spa' : 'ssr'}`
  : '';

// ssr & dev 时全量路径
const i18nLoadPath =
  IS_DEV && IS_SERVER_ENV ? `http://localhost:${port}` : assetPrefix;

const gbizI18nPath = `${cdnPrefix}/gbiz-next/${gbizVersion}`;

module.exports = {
  appName: name,
  cdnPrefix,
  assetPrefix,
  i18nLoadPath,
  gbizI18nPath,
};
