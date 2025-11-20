/**
 * Owner: simple@kupotech.com
 */
const path = require('path');

const cwd = process.cwd();

const PROJECT_CONFIG = {
  projectRoot: cwd,
  dir: path.resolve(cwd, '.neeko'),
  configFile: path.resolve(cwd, '.neeko.config.js'),
  taskFile: path.resolve(cwd, '.neeko.task.json'),
};

const GLOBAL_CONFIG_FILE = path.resolve(__dirname, '../.global.config.js');

const TASK_TEMP = `{
  "title": "",
  "tag": "",
  "description": "",
  "keys": [
    {
      "key": "",
      "value": "",
      "description": "",
      "char_limit": 0
    }
  ]
}`;

const CONF_TEMP = `
module.exports = {
  dir: './public/locale',
  standard: 'zh_CN.js',
  target: 'en_US.js',
  template: 'template.csv',
  jsSyntax: \`
    const _KC_PAGE_LANG_LOADER = (key, value) => value;
    return \`,
  jsTemplate: '_KC_PAGE_LANG_LOADER("&{code}", &{data})',
  ext: '.js',
  projectId: '',
  codeMap: null,
  branch: '',
  includeTags: [''],
};
`;

const JS_EXT = '.js';
const JSON_EXT = '.json';

module.exports = {
  PROJECT_CONFIG,
  JS_EXT,
  JSON_EXT,
  CONF_TEMP,
  TASK_TEMP,
  GLOBAL_CONFIG_FILE,
};
