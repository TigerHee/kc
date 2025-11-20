/**
 * 生成 new.json 文件
 * Owner: hanx.wei@kupotech.com
 */
const fse = require('fs-extra');
const _ = require('lodash');
const langs = require('./old');

// 新语言配置
const oldToNew = _.reduce(
  langs,
  (acc, lang) => {
    if (lang === 'zh_HK') {
      acc[lang] = 'zh-hant';
    } else if (lang === 'zh_CN') {
      acc[lang] = 'zh-hans';
    } else {
      acc[lang] = _.split(lang, '_')[0];
    }
    return acc;
  },
  {}
);
// 语言子路径对原有语言的映射，用于新闻等列表接口的语言参数处理
const newToOld = Object.keys(oldToNew).reduce((result, cur) => {
  return {
    ...result,
    [oldToNew[cur]]: cur,
  };
}, {});

fse.writeJsonSync(`${__dirname}/new.json`, { oldToNew, newToOld }, { spaces: 2 });
