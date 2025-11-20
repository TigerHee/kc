/* eslint-disable no-new-func */
/**
 * 检测语言包中的变量是否一致，以英文的变量为基准 进行对比
 */

const _ = require('lodash');

const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const localesPath = path.join(cwd, './public/locale');

const localeData = {};
const syntaxReplace = '{_SYNTAX_LOCALE_CONTENT_}';
const syntax = `
const _KC_PAGE_LANG_LOADER = (key, value) => value;
return `;
// 对比基准
const indexLang = 'en_US';

const getJsFunction = (data) => {
  let jsSyntax = data;

  if (typeof syntax === 'string') {
    if (syntax.indexOf(syntaxReplace) > -1) {
      jsSyntax = syntax.replace(syntaxReplace, data);
    } else {
      jsSyntax = syntax + data;
    }
  }

  if (typeof syntax === 'function') {
    jsSyntax = syntax(data);
  }

  return new Function(jsSyntax);
};

const dirs = fs.readdirSync(localesPath);
_.each(dirs, (filename) => {
  if (filename.match('.js')) {
    const key = filename.replace(/\.js$/, '');
    const localeFile = path.resolve(localesPath, filename);
    const content = fs.readFileSync(localeFile, { encoding: 'utf8' });
    const func = getJsFunction(content);
    const json = func();
    localeData[key] = json;
  }
});

const indexKeys = Object.keys(localeData[indexLang]);

const allLocaleKeys = Object.keys(localeData).filter((key) => key !== indexLang);

const dataKeyReg = /(?<=data-key.?=.\S*)((\w|-)+)(?="|')/g;
const variableReg = /(?<={\s?)(\w|-)+(?=\s?})/g;

const aDataKeyMap = {};
const variableMap = {};
let inValid = false;

// 生成表头 ( \ufeff --> 防止乱码 )
let csvDataKey = `\ufeff#以 ${indexLang} 为基准对比\n`;
csvDataKey += 'Lang,';
csvDataKey += ' Key,';
csvDataKey += ' IndexVar,';
csvDataKey += ' CompareVar\n';

let csvVariable = `\ufeff#以 ${indexLang} 为基准对比\n`;
csvVariable += 'Lang,';
csvVariable += ' Key,';
csvVariable += ' IndexVar,';
csvVariable += ' CompareVar\n';

_.each(indexKeys, (key) => {
  const itemData = localeData[indexLang][key];
  if (itemData.indexOf('<a') > -1) {
    const dataKey = itemData.match(dataKeyReg);
    _.each(allLocaleKeys, (lang) => {
      const langItem = localeData[lang][key];
      if (langItem && langItem.indexOf('<a') > -1) {
        const langDataKey = langItem.match(dataKeyReg);
        const difference = _.difference(dataKey, langDataKey);
        if (difference.length) {
          csvDataKey += `${lang},`;
          csvDataKey += ` ${key},`;
          csvDataKey += ` [${dataKey.join(',')}],`;
          if (langDataKey) {
            csvDataKey += ` [${langDataKey.join(',')}]\n`;
          } else {
            csvDataKey += ' null\n';
          }
          if (!aDataKeyMap[key]) {
            aDataKeyMap[key] = { [indexLang]: dataKey };
          }
          aDataKeyMap[key][lang] = langDataKey;
        }
      }
    });
  }
});

_.each(indexKeys, (key) => {
  const itemData = localeData[indexLang][key];
  if (itemData.match(variableReg)) {
    const variable = itemData.match(variableReg);
    _.each(allLocaleKeys, (lang) => {
      const langItem = localeData[lang][key];
      if (langItem && langItem.match(variableReg)) {
        const langVariable = langItem.match(variableReg);
        const difference = _.difference(variable, langVariable);
        if (difference.length) {
          csvVariable += `${lang},`;
          csvVariable += ` ${key},`;
          csvVariable += ` [${variable.join(',')}],`;
          if (langVariable) {
            csvVariable += ` [${langVariable.join(',')}]\n`;
          } else {
            csvVariable += ' null\n';
          }
          if (!variableMap[key]) {
            variableMap[key] = { [indexLang]: variable };
          }
          variableMap[key][lang] = langVariable;
        }
      }
    });
  }
});

if (Object.keys(aDataKeyMap).length) {
  console.log('exist difference <a data-key --->');
  // console.table(aDataKeyMap);
  inValid = true;
}

if (Object.keys(variableMap).length) {
  console.log('exist difference variableKey --->');
  // console.log(variableMap);
  inValid = true;
}

if (!fs.existsSync('./.locale')) {
  fs.mkdirSync('./.locale');
}
fs.writeFile('./.locale/dataKeyDiff.csv', csvDataKey, (err) => {
  if (err) console.log(err);
});
fs.writeFile('./.locale/dataKeyDiff.json', JSON.stringify(aDataKeyMap, null, 2), (err) => {
  if (err) console.log(err);
});
fs.writeFile('./.locale/keyDiff.csv', csvVariable, (err) => {
  if (err) console.log(err);
});
fs.writeFile('./.locale/keyDiff.json', JSON.stringify(variableMap, null, 2), (err) => {
  if (err) console.log(err);
});

if (inValid) {
  console.log('[locale check variable] Invalid');
} else {
  console.log('[locale check variable] no error');
}
