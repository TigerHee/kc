const fs = require("fs");
const path = require("path");

const __KC_LANGUAGES__ = require("../languages");
let __ALL__ = [];
Object.keys(__KC_LANGUAGES__).forEach((key) => {
  __ALL__.push(...__KC_LANGUAGES__[key]);
});
__ALL__ = Array.from(new Set(__ALL__));

if (!__ALL__.includes("ar_AE")) {
  __ALL__.push("ar_AE");
}
if (!__ALL__.includes("ur_PK")) {
  __ALL__.push("ur_PK");
}

const __LANGUAGES__ = Object.assign({ __ALL__ }, __KC_LANGUAGES__);

const __LANGUAGES_BASE_MAP__ = {
  baseToLang: {},
  langToBase: {},
};
__LANGUAGES__.__ALL__.reduce((baseToLang, lang) => {
  switch (lang) {
    case 'en_US':
      break;
    case 'zh_HK':
      baseToLang['zh-hant'] = lang;
      break;
    // case 'zh_CN':
    //   baseToLang['zh-hans'] = lang;
    //   break;
    default:
      const base = lang.split('_')[0];
      baseToLang[base] = lang;
  }
  return baseToLang;
}, __LANGUAGES_BASE_MAP__.baseToLang);
__LANGUAGES__.__ALL__.reduce((langToBase, lang) => {
  switch (lang) {
    case 'en_US':
      break;
    case 'zh_HK':
      langToBase[lang] = 'zh-hant';
      break;
    // case 'zh_CN':
    //   langToBase[lang] = 'zh-hans';
    //   break;
    default:
      const base = lang.split('_')[0];
      langToBase[lang] = base;
  }
  return langToBase;
}, __LANGUAGES_BASE_MAP__.langToBase);

const content = `
// this file is generate by genLanguage for rollup
// don't edit this file
window.__KC_LANGUAGES__ =  ${JSON.stringify(__LANGUAGES__)};
window.__KC_LANGUAGES_BASE_MAP__ =  ${JSON.stringify(__LANGUAGES_BASE_MAP__)};
`;

fs.writeFileSync(path.resolve(__dirname, "../src/languages.js"), content);

console.log("Gen Language SUCCESS!");
