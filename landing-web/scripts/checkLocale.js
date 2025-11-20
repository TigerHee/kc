/**
 * 检验语言包一致性
 */
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const localesPath = path.join(cwd, './static/locales');

global._KC_LOCALE_DATA = {};
global._KC_PAGE_LANG_LOADER = function _KC_PAGE_LANG_LOADER(lang, locale) {
  if (!_KC_LOCALE_DATA[lang]) { _KC_LOCALE_DATA[lang] = locale; }
};

const dirs = fs.readdirSync(localesPath);
_.each(dirs, (filename) => {
  const localeFile = path.resolve(localesPath, filename);
  require(localeFile); // eslint-disable-line import/no-dynamic-require
});

let inValid = false;
const enUSKeys = Object.keys(_KC_LOCALE_DATA.en_US);
_.each(_KC_LOCALE_DATA, (obj, key) => {
  if (key !== 'en_US') {
    const values = Object.keys(obj);
    const diffEnToOther = _.difference(enUSKeys, values);
    const diffOtherToEn = _.difference(values, enUSKeys);

    if (diffEnToOther.length || diffOtherToEn.length) {
      inValid = true;
      if (diffEnToOther.length) {
        console.log(`[locale check] diff en_US => ${key}`);
        console.log(diffEnToOther);
      }
      if (diffOtherToEn.length) {
        console.log(`[locale check] diff ${key} => en_US`);
        console.log(diffOtherToEn);
      }
    }
  }
});

if (inValid) {
  console.log('[locale check] Invalid Locales');
  process.exit(1);
} else {
  console.log('[locale check] Locales valid');
}
