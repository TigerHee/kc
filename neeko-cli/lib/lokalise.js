/**
 * Owner: simple@kupotech.com
 */
const fs = require('fs');
const path = require('path');
const request = require('request');
const unzipper = require('unzipper');
const { LokaliseApi } = require('@lokalise/node-api');
const {
  PROJECT_CONFIG,
  JSON_EXT,
  JS_EXT,
  GLOBAL_CONFIG_FILE,
} = require('./const');
const {
  fsAccess,
  getJsFunction,
  deleteOneFile,
  deleteFiles,
  fsReadFile,
  getNowTimeFormat,
} = require('./utils');

const _groups = [6686];

const parseJsTemplate = (code, data, temp) => {
  let result = temp.replace(/\&\{code\}/, () => code);

  result = result.replace(/\&\{data\}/, () => JSON.stringify(data, null, 2));

  return result;
};

const parseJson = (data) => {
  return JSON.stringify(data, null, 2);
};

const extractLocale = (data, jsSyntax) => {
  const getLocaleFnc = getJsFunction(data, jsSyntax);

  const locale = getLocaleFnc();

  return locale;
};

const createTask = async (config, lokaliseApi, isUpdate) => {
  try {
    const taskData = fs.readFileSync(PROJECT_CONFIG.taskFile, 'utf-8');
    const taskJson = JSON.parse(taskData);
    const { title, tag, description, keys } = taskJson || {};
    if (!title || !tag || !keys) {
      console.log('failed：title、tag、keys为必填项，请核查！');
      return;
    }
    const useKeys = new Set();
    const _keys = [];
    for (let i = 0; i < keys.length; i++) {
      const { key, value, description: _des, char_limit } = keys[i] || {};
      if (!key || !value) {
        console.log('failed：key、value为必填项，请核查！');
        return;
      }
      const map = {
        platforms: ['web'],
        key_name: key,
        tags: [tag],
        description: _des || description || '',
        translations: [
          {
            language_iso: 'zh_CN',
            translation: value,
          },
        ],
      };
      if (char_limit) {
        map['char_limit'] = char_limit;
      }
      _keys.push(map);
      useKeys.add(key);
    }
    if (!_keys || !_keys.length) {
      console.log('没有可创建的key');
      return;
    }
    if ([...useKeys].length !== _keys.length) {
      // 文件中key有重复
      console.log('文件中有重复key，请核查');
      return;
    }
    const { projectId, branch, groupIds } = config || {};
    const _projectId = branch ? `${projectId}:${branch}` : projectId;
    // 先查询已有key，修改要用key_id，新建要避免key重复
    const queryKeys = await lokaliseApi.keys.list({
      project_id: _projectId,
      filter_keys: [...useKeys].join(','),
      page: 1,
      limit: _keys.length + 1,
    });
    const resKeyNames = [];
    const resKeys = [];
    if (isUpdate) {
      // 修改key，需要key_id
      const keyMap = {};
      const { items: oldKeys } = queryKeys || {};
      (oldKeys || []).forEach((item) => {
        const { key_id, key_name } = item || {};
        const { web } = key_name || {};
        keyMap[web] = key_id;
      });
      const _keys2 = _keys.map((item) => {
        const { key_name } = item || {};
        return {
          ...item,
          key_id: keyMap[key_name],
        };
      });
      const result = await lokaliseApi.keys.bulk_update(_keys2, {
        project_id: _projectId,
      });
      const { items, errors } = result || {};
      (items || []).forEach((item) => {
        const { key_id, key_name } = item || {};
        if (key_id) {
          const { web } = key_name || {};
          resKeys.push(key_id);
          resKeyNames.push(web);
        }
      });
      if (errors && errors.length) {
        console.log(errors);
      }
    } else {
      // 创建key，先检查有没有重复
      const { items: oldKeys } = queryKeys || {};
      if (oldKeys && oldKeys.length) {
        const oldKeyList = [];
        oldKeys.forEach((item) => {
          const { key_name } = item || {};
          const { web } = key_name || {};
          oldKeyList.push(web);
        });
        console.log('以下key已存在，请修改：', oldKeyList);
        return;
      }
      const result = await lokaliseApi.keys.create(_keys, {
        project_id: _projectId,
      });
      const { items, errors } = result || {};
      (items || []).forEach((item) => {
        const { key_id, key_name } = item || {};
        if (key_id) {
          const { web } = key_name || {};
          resKeys.push(key_id);
          resKeyNames.push(web);
        }
      });
      if (errors && errors.length) {
        console.log(errors);
      }
    }
    if (!resKeys || !resKeys.length) {
      console.log('failed：没有可用于创建任务的有效key');
      return;
    }
    const strPre = isUpdate ? '成功修改key：' : '成功新建key：';
    console.log(strPre, resKeyNames);
    // 创建任务
    const _task = {
      title: `${title}_${getNowTimeFormat()}`,
      description: description,
      keys: resKeys,
      languages: [
        {
          language_iso: 'en',
          groups: groupIds || _groups,
        },
      ],
      source_language_iso: 'zh_CN',
      auto_close_items: true,
      auto_close_task: false,
      task_type: 'translation',
    };
    const task = await lokaliseApi.tasks.create(_task, {
      project_id: _projectId,
    });
    console.log('任务已创建--', task.task_id);
  } catch (e) {
    console.error(e);
  }
};

const uploadFunc = async (uploadPath, config, lokaliseApi) => {
  // 上传文件，顺序上传
  console.log('上传文件');
  const localeFiles = fs.readdirSync(uploadPath);
  for (const localeFileName of localeFiles) {
    const filePath = path.resolve(uploadPath, localeFileName);
    if (filePath) {
      const lcoaleKey = path.basename(
        localeFileName,
        path.extname(localeFileName),
      );
      const localeData = await fsReadFile(filePath, 'utf-8');
      if (localeData.length < 3) {
        console.log(`${localeFileName} 无增量内容`);
        continue;
      }
      const b = new Buffer(localeData);
      try {
        const { projectId, branch } = config || {};
        const _projectId = branch ? `${projectId}:${branch}` : projectId;
        const process = await lokaliseApi.files.upload(_projectId, {
          data: b.toString('base64'),
          filename: localeFileName,
          lang_iso: lcoaleKey,
          convert_placeholders: false,
        });
        console.log(`${localeFileName} 上传状态：${process.status}`);
      } catch (e) {
        console.log(e);
      }
    }
  }
};

const uploadInit = async (config, lokaliseApi, tmpDir) => {
  try {
    // 初始上传，取出所有文件转换成对应的可上传json文件
    const { dir, ext, jsSyntax, codeMap } = config || {};
    if (dir && codeMap) {
      const uploadPath = path.resolve(tmpDir, 'upload');
      if (fs.existsSync(uploadPath)) {
        deleteFiles(uploadPath);
      }
      fs.mkdirSync(uploadPath);
      const finishKeys = [];
      const keys = Object.keys(codeMap) || [];
      keys.forEach(async (lokaliseCode) => {
        const localeCode = codeMap[lokaliseCode];
        if (localeCode && lokaliseCode) {
          const localePath = path.resolve(dir, `${localeCode}${ext}`);
          const lokalisePath = path.resolve(uploadPath, `${lokaliseCode}.json`);
          const localeData = await fsReadFile(localePath, 'utf8');
          let locale;
          if (ext === JS_EXT) {
            locale = extractLocale(localeData, jsSyntax);
          } else {
            locale = JSON.parse(localeData);
          }
          fs.writeFile(lokalisePath, JSON.stringify(locale), 'utf8', (err) => {
            if (err) {
              throw err;
            } else {
              finishKeys.push(lokaliseCode);
              if (finishKeys.length >= keys.length) {
                uploadFunc(uploadPath, config, lokaliseApi);
              }
            }
          });
        }
      });
    }
  } catch (e) {
    console.error(e);
  }
};

const handleLocal = async (localePath, config, cmd, lokaliseApi, tmpDir) => {
  const { codeMap, dir, ext } = config || {};
  const finishKeys = [];
  let uploadPath = '';
  if (cmd.upload) {
    if (!codeMap || !tmpDir) {
      return;
    }
    uploadPath = path.resolve(tmpDir, 'upload');
    if (fs.existsSync(uploadPath)) {
      deleteFiles(uploadPath);
    }
    fs.mkdirSync(uploadPath);
  }
  const localeFiles = fs.readdirSync(localePath);
  for (const localeFileName of localeFiles) {
    const filePath = path.resolve(localePath, localeFileName);
    if (filePath) {
      const lokaliseCode = path.basename(
        localeFileName,
        path.extname(localeFileName),
      );
      const lcoaleKey = codeMap[lokaliseCode] || '';
      if (!lcoaleKey) {
        finishKeys.push(lokaliseCode);
        continue;
      }
      const toPath = path.resolve(dir, `${lcoaleKey}${ext}`);
      if (!fs.existsSync(toPath)) {
        // 路径不存在
        console.log('failed：路径不存在：', toPath);
        continue;
      }
      const localeData = await fsReadFile(filePath, 'utf-8');
      const locale = JSON.parse(localeData);
      switch (ext) {
        case JS_EXT:
          if (cmd.replace) {
            // 替换模式
            fs.writeFileSync(
              toPath,
              parseJsTemplate(lcoaleKey, locale, config.jsTemplate),
            );
          }
          if (cmd.merge) {
            // 合并模式
            const oldLocaleData = fs.readFileSync(toPath, 'utf-8');
            const getOldLocaleFnc = getJsFunction(
              oldLocaleData,
              config.jsSyntax,
            );
            const oldLocale = getOldLocaleFnc();

            const data = { ...oldLocale, ...locale };
            fs.writeFileSync(
              toPath,
              parseJsTemplate(lcoaleKey, data, config.jsTemplate),
            );
          }
          if (cmd.add) {
            // 新增模式
            const oldLocaleData = fs.readFileSync(toPath, 'utf-8');
            const getOldLocaleFnc = getJsFunction(
              oldLocaleData,
              config.jsSyntax,
            );
            const oldLocale = getOldLocaleFnc();

            const data = { ...locale, ...oldLocale };
            fs.writeFileSync(
              toPath,
              parseJsTemplate(lcoaleKey, data, config.jsTemplate),
            );
          }
          if (cmd.upload) {
            // 取出本地有而lokalise没有的数据进行上传
            const oldLocaleData = fs.readFileSync(toPath, 'utf-8');
            const getOldLocaleFnc = getJsFunction(
              oldLocaleData,
              config.jsSyntax,
            );
            const oldLocale = getOldLocaleFnc();

            const lokaliseKeys = new Set();
            Object.keys(locale).forEach((key) => {
              lokaliseKeys.add(key);
            });
            // 遍历取出lokalise没有的翻译
            const diff = {};
            Object.keys(oldLocale).forEach((key) => {
              if (key && !lokaliseKeys.has(key)) {
                const value = oldLocale[key];
                diff[key] = value;
              }
            });
            // 写入json文件
            const lokalisePath = path.resolve(
              uploadPath,
              `${lokaliseCode}.json`,
            );
            fs.writeFile(lokalisePath, JSON.stringify(diff), 'utf8', (err) => {
              if (err) {
                throw err;
              } else {
                finishKeys.push(lokaliseCode);
                if (finishKeys.length >= localeFiles.length) {
                  uploadFunc(uploadPath, config, lokaliseApi);
                }
              }
            });
          }
          break;
        case JSON_EXT:
          if (cmd.replace) {
            // 替换模式
            fs.writeFileSync(toPath, parseJson(locale));
          }
          if (cmd.merge) {
            // 合并模式
            const oldLocaleData = fs.readFileSync(toPath, 'utf-8');
            const oldLocale = JSON.parse(oldLocaleData);

            const data = { ...oldLocale, ...locale };
            fs.writeFileSync(toPath, parseJson(data));
          }
          if (cmd.add) {
            // 新增模式
            const oldLocaleData = fs.readFileSync(toPath, 'utf-8');
            const oldLocale = JSON.parse(oldLocaleData);

            const data = { ...locale, ...oldLocale };
            fs.writeFileSync(toPath, parseJson(data));
          }
          if (cmd.upload) {
            // 取出本地有而lokalise没有的数据进行上传
            const oldLocaleData = fs.readFileSync(toPath, 'utf-8');
            const oldLocale = JSON.parse(oldLocaleData);

            const lokaliseKeys = new Set();
            Object.keys(locale).forEach((key) => {
              lokaliseKeys.add(key);
            });
            // 遍历取出lokalise没有的翻译
            const diff = {};
            Object.keys(oldLocale).forEach((key) => {
              if (key && !lokaliseKeys.has(key)) {
                const value = oldLocale[key];
                diff[key] = value;
              }
            });
            // 写入json文件
            const lokalisePath = path.resolve(
              uploadPath,
              `${lokaliseCode}.json`,
            );
            fs.writeFile(lokalisePath, JSON.stringify(diff), 'utf8', (err) => {
              if (err) {
                throw err;
              } else {
                finishKeys.push(lokaliseCode);
                if (finishKeys.length >= localeFiles.length) {
                  uploadFunc(uploadPath, config, lokaliseApi);
                }
              }
            });
          }
          break;
        default:
          throw new Error('Error ext config!');
      }
    }
  }
};

// 设置lokalise apiKey
const setApiKey = async (cmd) => {
  const globalConfig = require(GLOBAL_CONFIG_FILE);
  if (cmd.removeApiKey) {
    globalConfig.apiKey = '';
  } else {
    globalConfig.apiKey = cmd.args[0];
  }
  fs.writeFileSync(
    GLOBAL_CONFIG_FILE,
    'module.exports = ' + JSON.stringify(globalConfig, null, 2),
  );
};

const _lokalise = async (cmd) => {
  try {
    // 配置apiKey
    if ((cmd.addApiKey && cmd.args && cmd.args[0]) || cmd.removeApiKey) {
      await setApiKey(cmd);
      return;
    }
    // apiKey检查
    const globalConfig = require(GLOBAL_CONFIG_FILE);
    if (!globalConfig.apiKey) {
      console.log(
        'failed：请运行 `neeko lokalise --addApiKey xxxxxxxxxxx` 命令设置lokalise apiKey',
      );
      return;
    }
    await fsAccess(PROJECT_CONFIG.configFile);
    const config = require(PROJECT_CONFIG.configFile);
    // 不允许在项目中配置apiKey
    if (config.apiKey) {
      console.log(
        'failed：根据安全部门的要求，请先移除.neeko.config.js中的apiKey',
      );
      return;
    }
    if (!config.projectId || !config.codeMap) {
      console.log('failed：请配置lokalise相关参数（projectId、codeMap等）');
      return;
    }
    const { branch, includeTags, projectId } = config || {};
    if (branch) {
      console.log('当前使用分支：', branch);
    }
    if (includeTags && includeTags.length) {
      console.log('当前使用tag筛选项：', includeTags);
    }
    const tmpDir = PROJECT_CONFIG.dir;
    if (!fs.existsSync(tmpDir)) {
      fs.access(tmpDir, fs.constants.F_OK, (err) => {
        if (err) {
          fs.mkdirSync(tmpDir);
        }
      });
    }
    const lokaliseApi = new LokaliseApi({ apiKey: globalConfig.apiKey });
    if (cmd.upload && cmd.initial) {
      uploadInit(config, lokaliseApi, tmpDir);
      return;
    }
    if (cmd.task) {
      createTask(config, lokaliseApi, !!cmd.edit);
      return;
    }
    const downConfig = {
      format: 'json',
      original_filenames: false,
      export_empty_as: 'base',
      json_unescaped_slashes: true,
      replace_breaks: false,
      all_platforms: true,
    };
    if (config.includeTags && config.includeTags.length && !cmd.upload) {
      downConfig.include_tags = config.includeTags;
    }
    const _projectId = branch ? `${projectId}:${branch}` : projectId;
    const response = await lokaliseApi.files.download(_projectId, downConfig);

    // 从返回的url下载zip文件
    const { bundle_url } = response || {};
    if (bundle_url && fs.existsSync(tmpDir)) {
      const zipPath = path.resolve(tmpDir, 'locale.zip');
      const localePath = path.resolve(tmpDir, 'locale');
      deleteOneFile(zipPath);
      deleteFiles(localePath);
      const stream = fs.createWriteStream(zipPath);
      request(bundle_url)
        .pipe(stream)
        .on('close', (err) => {
          if (err) {
            console.log('failed：', err);
          } else {
            console.log('--下载完成--', bundle_url);
            // 解压缩
            const unzipExtractor = unzipper.Extract({
              path: path.resolve(tmpDir),
            });
            unzipExtractor.on('error', (err) => {
              throw err;
            });
            unzipExtractor.on('close', () => {
              // 处理多语文件
              console.log('--开始处理--');
              handleLocal(localePath, config, cmd, lokaliseApi, tmpDir);
            });
            fs.createReadStream(zipPath).pipe(unzipExtractor);
          }
        });
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = _lokalise;
