/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-06-12 17:25:10
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-11-13 16:49:17
 * @FilePath: /trade-web/scripts/manifest.js
 * @Description:
 */
// const getManifest = require('workbox-build/src/get-manifest');
const { getManifest } = require('workbox-build');
const path = require('path');
const fs = require('fs');
const md5 = require('md5');
// const { site } = require('../site-config.json');

const { version, name } = require('../package.json');

// const msite = site || '';
// const IS_TEST_ENV = msite.indexOf('sit') === 0 && msite.indexOf('site') < 0;
// const IS_SANDBOX = msite.indexOf('site-sdb') === 0;
// const IS_DEV = msite.indexOf('dev') > -1;
// const NOT_PROD = IS_DEV || IS_TEST_ENV || IS_SANDBOX;
const cdnHost = 'https://assets.staticimg.com';

const publicPath = `${cdnHost}/${name}/${version}/`;
// const publicPath = '/';


const SRC_DIR = path.join(__dirname, '..', 'dist');
const SW_DIR = path.join(__dirname, '..', 'public/sw.js');
const SW_DIST_DIR = path.join(__dirname, '..', 'dist/sw.js');
const PRECACHE_MANIFEST_NAME = `precache_manifest_${md5(version)}.js`;
const PRECACHE_MANIFEST_PATH = path.join(__dirname, '../dist', PRECACHE_MANIFEST_NAME);

const BASE_OPTIONS = {
  globDirectory: SRC_DIR,
  globIgnores: [
    'icons/**.js',
    '**/*.svg',
    '**/*.png',
    '**/*.ts',
    'charting_library_1.14/datafeed/udf/lib/**.*',
    'charting_library_1.14/**/*.html',
    'outdated-browser/**.*',
    'precache_manifest*.js',
  ],
  globPatterns: ['**/*.js', 'static/**.*', '**/*.css'],
  modifyURLPrefix: {
    '': publicPath,
  },
  maximumFileSizeToCacheInBytes: 1024 * 1024 * 10,
};

async function writePreCacheManifest(data) {
  try {
    data = `self.__precacheManifest = ${JSON.stringify(data)}`;
    fs.writeFileSync(PRECACHE_MANIFEST_PATH, data);
  } catch (e) {
    console.error(e);
  }
}

async function writeManifestToSw() {
  const _prefixStr = `${cdnHost}/${name}/`.replace(/(:|\/|\.)/g, '\\\\$1');
  const regExpStr = `^${_prefixStr}${version}`;
  fs.readFile(SW_DIR, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    const _data = data
        .replace('__static__prefix__regexp__', regExpStr)
        .replace('__name__version__', `${name}_${version}`)
        .replace('__project_name__', `${name}`)
        .replace('__public_cdn__', publicPath);
    // eslint-disable-next-line no-useless-concat
    const code = `importScripts('${publicPath}${PRECACHE_MANIFEST_NAME}');` + '\n' + `${_data}`;
    fs.writeFile(SW_DIST_DIR, code, 'utf8', () => {});
  });
}
async function main() {
  const { manifestEntries } = await getManifest(BASE_OPTIONS);
  await writePreCacheManifest(manifestEntries);
  await writeManifestToSw();
}

main();
