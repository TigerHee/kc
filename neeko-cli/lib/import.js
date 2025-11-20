/**
 * Owner: simple@kupotech.com
 */
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const { PROJECT_CONFIG, JSON_EXT, JS_EXT } = require('./const');
const { fsAccess, getJsFunction } = require('./utils');

const parseJsTemplate = (code, data, temp) => {
  let result = temp.replace(/\&\{code\}/, () => code);

  result = result.replace(/\&\{data\}/, () => JSON.stringify(data, null, 2));

  return result;
};

const parseJson = (data) => {
  return JSON.stringify(data, null, 2);
};

const _import = async (cmd) => {
  await fsAccess(PROJECT_CONFIG.configFile);

  const config = require(PROJECT_CONFIG.configFile);

  let isHeader = true;

  let locales = [];

  fs.createReadStream(path.resolve(PROJECT_CONFIG.dir, config.template)).pipe(
    csv
      .parse()
      .on('data', (row) => {
        if (isHeader) {
          isHeader = false;

          row.shift();

          locales = row.map((localeCode) => {
            return {
              __locale__: localeCode,
            };
          });
        } else {
          const key = row.shift();

          row.forEach((value, index) => {
            if (!!value) {
              locales[index][key] = value;
            }
          });
        }
      })
      .on('end', () => {
        switch (config.ext) {
          case JS_EXT:
            if (cmd.replace) {
              locales.forEach((locale) => {
                const code = locale.__locale__;
                delete locale.__locale__;

                fs.writeFileSync(
                  path.resolve(config.dir, `${code}${config.ext}`),
                  parseJsTemplate(code, locale, config.jsTemplate),
                );
              });
            }

            if (cmd.merge) {
              // 覆盖模式用template里面的覆盖掉已有的
              locales.forEach((locale) => {
                const oldLocaleData = fs.readFileSync(
                  path.resolve(config.dir, `${locale.__locale__}${config.ext}`),
                  'utf-8',
                );

                const getOldLocaleFnc = getJsFunction(
                  oldLocaleData,
                  config.jsSyntax,
                );

                const oldLocale = getOldLocaleFnc();

                const code = locale.__locale__;
                delete locale.__locale__;
                const data = { ...oldLocale, ...locale };

                fs.writeFileSync(
                  path.resolve(config.dir, `${code}${config.ext}`),
                  parseJsTemplate(code, data, config.jsTemplate),
                );
              });
            }
            break;
          case JSON_EXT:
            if (cmd.replace) {
              locales.forEach((locale) => {
                const code = locale.__locale__;
                delete locale.__locale__;

                fs.writeFileSync(
                  path.resolve(config.dir, `${code}${config.ext}`),
                  parseJson(locale),
                );
              });
            }

            if (cmd.merge) {
              locales.forEach((locale) => {
                const oldLocaleData = fs.readFileSync(
                  path.resolve(config.dir, `${locale.__locale__}${config.ext}`),
                  'utf-8',
                );

                const oldLocale = JSON.parse(oldLocaleData);

                const code = locale.__locale__;
                delete locale.__locale__;
                const data = { ...oldLocale, ...locale };

                fs.writeFileSync(
                  path.resolve(config.dir, `${code}${config.ext}`),
                  parseJson(data),
                );
              });
            }
            break;
          default:
            throw new Error('Error ext config!');
        }
      }),
  );
};

module.exports = _import;
