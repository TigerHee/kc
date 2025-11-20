/*
 * @Owner: jesse.shao@kupotech.com
 */
const { name, version } = require('./package.json');
const fs = require('fs');
const path = require('path');

const gbizLocal = process.env.GBIZ === 'local';
const _RELEASE_ = `${name}_${version}`;

const reactFile =
  process.env.NODE_ENV === 'production' ? 'react.production.min.js' : 'react.development.js';

const reactDomFile =
  process.env.NODE_ENV === 'production'
    ? 'react-dom.production.min.js'
    : 'react-dom.development.js';

const reactReduxFile =
  process.env.NODE_ENV === 'production' ? 'react-redux.js' : 'react-redux.min.js';

const systemjsFile = process.env.NODE_ENV === 'production' ? 'system.min.js' : 'system.js';

const commonStaticHost = 'https://assets.staticimg.com';

const sentryLoaderLink = `${commonStaticHost}/natasha/npm/sentry/7.52.1/sentry-loader.js`;

function getGbizImportMap() {
  if (process.env.NODE_ENV === 'development') {
    const siteArg = process.argv.find(arg => arg.indexOf('site=') !== -1);
    const site = (siteArg ? siteArg.slice(5) : 'main') || 'main';
    const devSiteLocal = (
      site === 'main' ? `${process.env.NGINX_ENV_ORIGIN}/g-biz/gbiz-old-import-map.json` :
        `${process.env[`NGINX_ENV_ORIGIN_${site.toUpperCase()}`]}/g-biz/gbiz-old-import-map.json`
    ) || 'https://nginx-web-01.sit.kucoin.net/g-biz/gbiz-old-import-map.json';

    return gbizLocal
      ? 'http://localhost:5001/gbiz-old-import-map.json'
      : devSiteLocal
  }

  return '/g-biz/gbiz-old-import-map.json';
}

const bootVersion = '1.9.13';

// 读取 errorReport.js 文件内容
let errorReportContent = '';
try {
  const errorReportPath = path.join(__dirname, 'scripts', 'errorReport.js');
  errorReportContent = fs.readFileSync(errorReportPath, 'utf-8');
} catch (error) {
  console.error('Failed to read errorReport.js:', error);
}

exports.context = {
  emotionCss_src: `${commonStaticHost}/natasha/npm/@emotion/css@11.5.0/dist/emotion-css.umd.min.js`,
  reactFile_src: `${commonStaticHost}/natasha/npm/react@17.0.2/umd/${reactFile}`,
  reactDomFile_src: `${commonStaticHost}/natasha/npm/react-dom@17.0.2/umd/${reactDomFile}`,
  reactReduxFile_src: `${commonStaticHost}/natasha/npm/react-redux@7.2.3/dist/${reactReduxFile}`,
  // boot.js 多站点
  relation_src: `${commonStaticHost}/web-domain-relation/${bootVersion}/boot.js?_v=${_RELEASE_}`,
  relation_integrity: 'sha384-4ZzbxDFT3ypYeSk9B0E+hr7ioMgZm+dPZLJAgFd9uQw6dR6cqjds3z5Fp4yuTkQw',
  relation_src_th: `${commonStaticHost}/web-domain-relation/${bootVersion}/boot_th.js?_v=${_RELEASE_}`,
  relation_integrity_th: 'sha384-ZJAzwhjH6sseqEk8pdFT9cMTE6wF3Jrp7astgLivcuO8j2neo10LmG0X6HETGAJN',
  relation_src_tr: `${commonStaticHost}/web-domain-relation/${bootVersion}/boot_tr.js?_v=${_RELEASE_}`,
  relation_integrity_tr: 'sha384-Q/Uab4djsTEGIvhwUw+CO/kI6huu/l9gD/geRwGJZ0AUTNRW7vcl2/I4yhJ7ZRn9',
  relation_src_au: `${commonStaticHost}/web-domain-relation/${bootVersion}/boot_au.js?_v=${_RELEASE_}`,
  relation_integrity_au: 'sha384-o7vKKwnCZtXrY1wZsRhCrQQ9SS/HjwrGoYJ37Y6Ci9EPduPZI16ZrNY3+W/UrSFQ',
  relation_src_eu: `${commonStaticHost}/web-domain-relation/${bootVersion}/boot_eu.js?_v=${_RELEASE_}`,
  relation_integrity_eu: 'sha384-m4HLRGsf5xbsnSmQMf9WJwcYANYH2trZwv3Hzxh2lbY7kNNSDlO0nEwwTSZL+SzC',
  relation_src_demo: `${commonStaticHost}/web-domain-relation/${bootVersion}/boot_demo.js?_v=${_RELEASE_}`,
  relation_integrity_demo: 'sha384-dIdhirngdIICvnyJCXu4MAc2r91TXcus3mGa9FpG9bEiCr0k4inKzaVHlQKXAMuq',
  relation_favicon: `/logo.png`,
  relation_favicon_th: `/logo_th.png`,
  relation_favicon_tr: `/logo_tr.png`,
  relation_favicon_eu: `/logo_eu.png`,
  relation_favicon_au: `/logo_au.png`,
  sentryLoader_src: sentryLoaderLink,
  kcsensors_src: `${commonStaticHost}/natasha/npm/@kc/sensors@1.3.0/umd/kcsensors.min.js`,
  importmap_src: getGbizImportMap(),
  systemjs_origin_src: `${commonStaticHost}/natasha/npm/systemjs/origin.js`,
  systemjs_src: `${commonStaticHost}/natasha/npm/systemjs@6.12.1/dist/${systemjsFile}`,
  gtm_src: `${commonStaticHost}/natasha/npm/gtm/gtm.js`,
  // 移动该资源，需要调整loading路径
  annualReportLoadingSrc: process.env.NODE_ENV === 'development' ? '/loading.png' : `${commonStaticHost}/landing-web/${version}/static/annual_report_loading.125f31d8.png`,
  promotionBannerImg: process.env.NODE_ENV === 'development' ? '/static/banner.c1bb2ebd.png' : `${commonStaticHost}/landing-web/${version}/static/banner.c1bb2ebd.png`,
  storage_src: `${commonStaticHost}/g-biz/externals/0.11.35/syncStorage.js`,
  // 添加 errorReport 脚本内容
  errorReport_script: errorReportContent,
};
