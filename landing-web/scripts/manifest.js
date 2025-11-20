const getManifest = require('workbox-build/src/get-manifest');
const path = require('path');
const fs = require('fs');
const md5 = require('md5');

const { version, name } = require('../package.json');

let cdnHost = 'https://assets.staticimg.com';

const publicPath = `${cdnHost}/${name}/${version}/`;

const SRC_DIR = path.join(__dirname, '..', 'dist');
const SW_DIR = path.join(__dirname, '..', 'public/sw.js');
const SW_DIST_DIR = path.join(__dirname, '..', 'dist/sw.js');
const PRECACHE_MANIFEST_NAME = `precache_manifest_${md5(version)}.js`;
const PRECACHE_MANIFEST_PATH = path.join(__dirname, '../dist', PRECACHE_MANIFEST_NAME);

const BASE_OPTIONS = {
  globDirectory: SRC_DIR,
  globIgnores: ['**/*.png', '**/*.svg', '**/*.jpg'],
  globPatterns: ['**/*.*'],
  modifyURLPrefix: {
    '': publicPath,
  },
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
