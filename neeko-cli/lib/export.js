/**
 * Owner: simple@kupotech.com
 */
const fs = require('fs');
const path = require('path');
const { PROJECT_CONFIG, JS_EXT } = require('./const');
const {
  getJsFunction,
  extractDiff,
  addLocaleKey,
  csvFormat,
  xlsxFormat,
  fsAccess,
  fsReadFile,
} = require('./utils');

const extractLocale = (data, jsSyntax, fileName) => {
  const getLocaleFnc = getJsFunction(data, jsSyntax);

  const locale = getLocaleFnc();

  return addLocaleKey(locale, fileName);
};

const _export = async (cmd) => {
  await fsAccess(PROJECT_CONFIG.configFile);

  const config = require(PROJECT_CONFIG.configFile);
  const localeFiles = fs.readdirSync(config.dir);
  const availableType = config.ext;

  // -a, --all参数表示提取config.dir下面所有的语言包

  if (cmd.all) {
    const locales = [];

    for (const localeFileName of localeFiles) {
      //匹配以.js结束的正则----  /^(?=.*\.js$)/
      if (
        availableType.split(',').some((item) => {
          let re = new RegExp('^(?=.*\\' + item + '$)', 'g');
          return re.test(localeFileName);
        })
      ) {
        const localeData = await fsReadFile(
          path.resolve(config.dir, localeFileName),
          'utf8',
        );

        let locale;

        if (availableType === JS_EXT) {
          locale = extractLocale(localeData, config.jsSyntax, localeFileName);
        } else {
          locale = addLocaleKey(JSON.parse(localeData), localeFileName);
        }

        locales.push(locale);
      }
    }

    const allKeys = new Set();

    locales.forEach((item) => {
      Object.keys(item).forEach((key) => {
        allKeys.add(key);
      });
    });

    if (cmd.excel) {
      xlsxFormat([...allKeys], locales, {
        pathname: path.resolve(PROJECT_CONFIG.dir, 'ALL.xlsx'),
      });
    } else {
      csvFormat([...allKeys], locales, {
        pathname: path.resolve(PROJECT_CONFIG.dir, 'ALL.csv'),
      });
    }
  }

  // -i, --increment参数表示提取和standard文件的差异key

  if (cmd.increment) {
    const standardLocaleData = await fsReadFile(
      path.resolve(config.dir, config.standard),
      'utf8'
    );

    const targetLocaleData = await fsReadFile(
      path.resolve(config.dir, config.target),
      'utf8'
    );

    let standardLocale;
    let targetLocale;

    if (availableType === JS_EXT) {
      standardLocale = extractLocale(
        standardLocaleData,
        config.jsSyntax,
        config.standard,
      );

      targetLocale = extractLocale(
        targetLocaleData,
        config.jsSyntax,
        config.target,
      );
    } else {
      standardLocale = addLocaleKey(
        JSON.parse(standardLocaleData),
        config.standard,
      );

      targetLocale = addLocaleKey(JSON.parse(targetLocaleData), config.target);
    }

    const increaseLocale = {
      __locale__: standardLocale.__locale__,
      ...extractDiff(standardLocale, targetLocale),
    };

    if (cmd.excel) {
      xlsxFormat(Object.keys(increaseLocale), [increaseLocale], {
        pathname: path.resolve(PROJECT_CONFIG.dir, 'INCREMENT.xlsx'),
      });
    } else {
      csvFormat(Object.keys(increaseLocale), [increaseLocale], {
        pathname: path.resolve(PROJECT_CONFIG.dir, 'INCREMENT.csv'),
      });
    }
  }

  // -k, --keys参数表示提取指定key
  if (cmd.specify) {
    const locales = [];

    for (const localeFileName of localeFiles) {
      //匹配以.js结束的正则----  /^(?=.*\.js$)/
      if (
        availableType.split(',').some((item) => {
          let re = new RegExp('^(?=.*\\' + item + '$)', 'g');
          return re.test(localeFileName);
        })
      ) {
        const localeData = await fsReadFile(
          path.resolve(config.dir, localeFileName),
          'utf8',
        );

        let locale;

        if (availableType === JS_EXT) {
          locale = extractLocale(localeData, config.jsSyntax, localeFileName);
        } else {
          locale = addLocaleKey(JSON.parse(localeData), localeFileName);
        }

        locales.push(locale);
      }
    }

    const keys = config.specify;

    if (cmd.excel) {
      xlsxFormat([...keys], locales, {
        pathname: path.resolve(PROJECT_CONFIG.dir, 'KEYS.xlsx'),
      });
    } else {
      csvFormat([...keys], locales, {
        pathname: path.resolve(PROJECT_CONFIG.dir, 'KEYS.csv'),
      });
    }
  }
};

module.exports = _export;
