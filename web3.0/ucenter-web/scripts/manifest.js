const { getManifest } = require('workbox-build');
const path = require('path');
const fs = require('fs');
const md5 = require('md5');

const { version, name } = require('../package.json');

const cdnPath = `${name}/${version}/`;

const cdnHost = 'https://assets.staticimg.com';

const publicPath = `${cdnHost}/${cdnPath}`;
// const preManifest =
// const publicPath = '/';

const SRC_DIR = path.join(__dirname, '..', cdnPath);
const SW_DIR = path.join(__dirname, '..', 'cdnAssets/static/swOrigin/sw.js');
const SW_DIST_DIR = path.join(__dirname, '..', `dist/sw.js`);
const PRECACHE_MANIFEST_NAME = `precache_manifest_${md5(version)}.js`;
const PRECACHE_MANIFEST_PATH = path.join(__dirname, `../dist/${cdnPath}`, PRECACHE_MANIFEST_NAME);

const BASE_OPTIONS = {
  globDirectory: SRC_DIR,
  globIgnores: ['**/*.png', '**/*.svg', '**/*.jpg'],
  globPatterns: ['static/**/**.js', 'static/**/**.css'],
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
    const code =
      `importScripts('${`${cdnHost}/${cdnPath}`}${PRECACHE_MANIFEST_NAME}');` + '\n' + `${_data}`;
    fs.writeFile(SW_DIST_DIR, code, 'utf8', () => {});
  });
}
async function main() {
  const { manifestEntries } = await getManifest(BASE_OPTIONS);
  await writePreCacheManifest(manifestEntries);
  await writeManifestToSw();
}

module.exports = main;
