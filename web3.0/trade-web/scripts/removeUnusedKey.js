const fs = require('fs');
const path = require('path');

/**
 * @see https://k-devdoc.atlassian.net/wiki/spaces/frontend/pages/109580399
 * 使用步骤：
 * 1. 从编辑器拷贝文件路径,sourceLocalesPath 有值则会去源项目拉取翻译合并进目标项目
 * 2. 执行: node index.js
 * 3. 去目标项目.neeko.config.js内配置diffConfig，执行：neeko diff
 * 4. 去掉 sourceLocalesPath 的值，设置 targetDiffPath 的值，执行: node index.js
 * 5. 然后根据实际情况之前 neeko 命令，拉取或上传
 *
 * 1-2: 拷贝翻译到目标项目， 3-5：去除未使用的key
 */

// 源项目locales目录
// const sourceLocalesPath = '/Users/raylee/Lee/Work/Pro/kucoin-main-web/cdnAssets/static/locales';
const sourceLocalesPath = '';

// 目标项目locales目录
const targetLocalesPath = `${__dirname}/../public/locale`;

// 目标项目diff路径
const targetDiffPath = `${__dirname}/../.neeko/diff.json`;

// 是 gbiz 或者 main-web,public-web
const isGbiz = false;

const _KC_PAGE_LANG_LOADER = (a, b) => {
  return [a, b];
};

const jsTemplate = '_KC_PAGE_LANG_LOADER("&{code}", &{data})';

const parseJsTemplate = (code, data, temp) => {
  // eslint-disable-next-line no-useless-escape
  let result = temp.replace(/\&\{code\}/, () => code);

  // eslint-disable-next-line no-useless-escape
  result = result.replace(/\&\{data\}/, () => JSON.stringify(data, null, 2));

  return result;
};

const init = () => {
  // 目标项目没用的key
  let localeOnly = [];
  try {
    if (targetDiffPath) {
      const diffDataStr = fs.readFileSync(targetDiffPath, 'utf8');
      const diffData = JSON.parse(diffDataStr);
      localeOnly = diffData.localeOnly;
    }
  } catch (err) {
    console.error(err);
  }

  try {
    fs.readdirSync(targetLocalesPath).forEach((file) => {
      const targetFilePath = path.join(targetLocalesPath, file);
      console.log('targetFilePath === ', targetFilePath);

      const stat = fs.statSync(targetFilePath);
      // console.log('stat === ', stat);
      if (stat.isFile() && path.extname(targetFilePath) === '.js') {
        const code = fs.readFileSync(targetFilePath, 'utf8');
        // eslint-disable-next-line no-eval
        const params = eval(code);
        const lang = params[0];
        const targetContent = params[1];

        let fullContent = {};

        // 有源项目locales目录就去读，没有就用目标项目的数据处理
        if (sourceLocalesPath) {
          const sourceFilePath = path.join(sourceLocalesPath, file);
          const sourceCode = fs.readFileSync(sourceFilePath, 'utf8');

          if (isGbiz) {
            // eslint-disable-next-line no-new-func
            const fn = new Function(sourceCode.replace('export default', 'return'));
            const sourceContent = fn();
            fullContent = { ...sourceContent, ...targetContent };
          } else {
            // eslint-disable-next-line no-eval
            const sourceParams = eval(sourceCode);
            const sourceContent = sourceParams[1];
            fullContent = { ...sourceContent, ...targetContent };
          }
        } else {
          fullContent = { ...targetContent };
        }

        let content = {};
        if (localeOnly.length) {
          Object.keys(fullContent).forEach((key) => {
            if (!localeOnly.includes(key)) {
              content[key] = fullContent[key];
            }
          });
        } else {
          content = fullContent;
        }

        fs.writeFileSync(targetFilePath, parseJsTemplate(lang, content, jsTemplate));
      }
    });
  } catch (error) {
    console.error(error);
  }
};

init();
