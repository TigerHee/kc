/**
 * Owner: willen@kupotech.com
 */
const fs = require('fs');
const path = require('path');
const { PROJECT_CONFIG, JS_EXT, GLOBAL_CONFIG_FILE } = require('./const');
const { fsAccess, getJsFunction, fsReadFile } = require('./utils');
const request = require('request');

// 标准定义key集合（调用国际化方法时入参key为确定字符串，如：_t("xxx")）
const commonProjectUsedKeys = new Set();
// 非标准定义key集合（调用方法时入参key为变量而非确定字符串，如：var a="xxx"; _t(a)）
const unCommonProjectUsedKeys = new Set();
// 需要保留的key集合
const keepKeys = new Set();

// 匹配标准定义key集合
const getProjectJsPathByReg = (list, diffConfig) => {
  list.forEach((currentPath) => {
    // 跳过excludeDirs
    if (
      diffConfig.excludeDirs &&
      diffConfig.excludeDirs.some((one) => path.join(one) === currentPath)
    ) {
      return;
    }
    const stat = fs.statSync(currentPath);
    if (stat.isFile()) {
      const suffix = currentPath.split('.').pop();
      if (diffConfig.ext.includes(suffix)) {
        const fileString = fs.readFileSync(
          path.join(PROJECT_CONFIG.projectRoot, currentPath),
          'utf8',
        );
        diffConfig.functionNames.forEach((funcKey) => {
          const reg = new RegExp(
            `${funcKey}\\(\\s*?['"](.*?)['"]\\s*?[,)]`,
            'g',
          );
          const matchList = fileString.match(reg) || [];
          matchList.forEach((i) => {
            const key = i.replace(reg, '$1');
            commonProjectUsedKeys.add(key);
          });
        });
      }
    } else {
      const list1 = fs.readdirSync(currentPath);
      getProjectJsPathByReg(
        list1.map((i) => path.join(currentPath, i)),
        diffConfig,
      );
    }
  });
};

// 匹配非标准定义key集合
const getProjectJsPathBySearch = (list, diffConfig, localeList) => {
  list.forEach((currentPath) => {
    // 跳过excludeDirs
    if (
      diffConfig.excludeDirs &&
      diffConfig.excludeDirs.some((one) => path.join(one) === currentPath)
    ) {
      return;
    }
    const stat = fs.statSync(currentPath);
    if (stat.isFile()) {
      const suffix = currentPath.split('.').pop();
      if (diffConfig.ext.includes(suffix)) {
        const fileString = fs.readFileSync(
          path.join(PROJECT_CONFIG.projectRoot, currentPath),
          'utf8',
        );
        localeList.forEach((key) => {
          if (fileString.includes(key)) {
            unCommonProjectUsedKeys.add(key);
          }
        });
      }
    } else {
      const list1 = fs.readdirSync(currentPath);
      getProjectJsPathBySearch(
        list1.map((i) => path.join(currentPath, i)),
        diffConfig,
        localeList,
      );
    }
  });
};

// 获取翻译平台session
const getTranslatePlatformSession = async () => {
  const globalConfig = require(GLOBAL_CONFIG_FILE);
  if (globalConfig && globalConfig.transTaskSession) {
    return globalConfig.transTaskSession;
  } else {
    throw Error(
      '若diff有配置keepKeysWithTaskId, 请先使用 `neeko diff --addTaskSession xxxx` 注入翻译平台session',
    );
  }
};

// 保留产品翻译平台taskId关联的key
let session = '';
const keepKeysWithTaskId = async (taskIdList) => {
  session = session || (await getTranslatePlatformSession());
  if (!session) return;
  return await new Promise(async (resolve) => {
    (
      await function loop(index) {
        const taskId = taskIdList[index];
        if (!taskId) {
          resolve();
          return;
        }
        request(
          {
            uri: `http://10.40.0.201/api/task/pull/${taskId}`,
            headers: { Cookie: 'c=' + session },
            json: true,
          },
          function (error, response, body) {
            if (error || body.code === 401) {
              throw Error(
                `${taskId}获取失败，请确保注入的翻译平台session是否有效，\n可使用\`neeko diff --addTaskSession xxxx\` 重新注入翻译平台session\n`,
              );
            } else {
              if (
                body.data &&
                body.data.screenshots &&
                body.data.screenshots.length
              ) {
                console.log(`${taskId} 查询成功`);
                body.data.screenshots.forEach((i) => {
                  if (i.keys && i.keys.length) {
                    i.keys.forEach((j) => j.key && keepKeys.add(j.key));
                  }
                });
              }
            }
            loop(++index);
          },
        );
      }
    )(0);
  });
};

// 设置翻译平台session
const setTaskSession = async (cmd) => {
  const globalConfig = require(GLOBAL_CONFIG_FILE);
  if (cmd.removeTaskSession) {
    globalConfig.transTaskSession = '';
  } else {
    globalConfig.transTaskSession = cmd.args[0];
  }
  fs.writeFileSync(
    GLOBAL_CONFIG_FILE,
    'module.exports = ' + JSON.stringify(globalConfig, null, 2),
  );
};

const _diff = async (cmd) => {
  try {
    if (
      (cmd.addTaskSession && cmd.args && cmd.args[0]) ||
      cmd.removeTaskSession
    ) {
      setTaskSession(cmd);
      return;
    }
    await fsAccess(PROJECT_CONFIG.configFile);
    const config = require(PROJECT_CONFIG.configFile);
    const { dir, ext, standard, jsSyntax, diffConfig } = config || {};
    // 检查必填项
    if (
      !diffConfig ||
      !diffConfig.includeDirs ||
      !diffConfig.includeDirs.length ||
      !diffConfig.ext ||
      !diffConfig.ext.length ||
      !diffConfig.functionNames ||
      !diffConfig.functionNames.length
    ) {
      console.log(
        '执行失败，diffConfig必填参数缺失（includeDirs，ext, functionNames）',
      );
      return;
    }
    const startTimestamp = Date.now();
    // 获取standard语言下所有的key
    const localePath = path.resolve(dir, standard);
    const localeData = await fsReadFile(localePath, 'utf8');
    let locale;
    if (ext === JS_EXT) locale = getJsFunction(localeData, jsSyntax)();
    else locale = JSON.parse(localeData);
    // 匹配标准定义key集合
    getProjectJsPathByReg(diffConfig.includeDirs, diffConfig);
    // 匹配非标准定义key集合（过滤掉已命中标准定义的key）
    let tempNeverUsed = new Set();
    Object.keys(locale).forEach((key) => {
      if (!commonProjectUsedKeys.has(key)) tempNeverUsed.add(key);
    });
    getProjectJsPathBySearch(
      diffConfig.includeDirs,
      diffConfig,
      Array.from(tempNeverUsed),
    );
    // 需要保留的key
    diffConfig.keepKeys && diffConfig.keepKeys.forEach((i) => keepKeys.add(i));
    // 保留产品翻译平台taskId关联的key
    if (diffConfig.keepKeysWithTaskId && diffConfig.keepKeysWithTaskId.length) {
      await keepKeysWithTaskId(diffConfig.keepKeysWithTaskId);
    }
    // commonUsed && unCommonUsed中有但语言文件中没有的key
    const excludeKey = new Set();
    Array.from(commonProjectUsedKeys)
      .concat(Array.from(unCommonProjectUsedKeys))
      .forEach((key) => {
        if (!locale[key]) excludeKey.add(key);
      });

    // 标准语言中有但commonUsed && unCommonUsed && keepKeys没有的key
    let excludeKey2 = new Set();
    Object.keys(locale).forEach((key) => {
      if (
        !commonProjectUsedKeys.has(key) &&
        !unCommonProjectUsedKeys.has(key) &&
        !keepKeys.has(key)
      )
        excludeKey2.add(key);
    });

    // 打印概要
    console.table({
      locale: {
        counts: Object.keys(locale).length,
        remarks: `${standard}中key总数量`,
      },
      commonUsed: {
        counts: commonProjectUsedKeys.size,
        remarks: '调用国际化方法时入参key为确定字符串，如：_t("xxx")',
      },
      unCommonUsed: {
        counts: unCommonProjectUsedKeys.size,
        remarks:
          '调用方法时入参key为变量而非确定字符串，如：var a="xxx"; _t(a)',
      },
      keepKeys: {
        counts: keepKeys.size,
        remarks: '需要保留的key，通过keepKeys与keepKeysWithTaskId关联的key',
      },
      projectOnly: {
        counts: excludeKey.size,
        remarks: `commonUsed && unCommonUsed中有但${standard}中没有的key，此项正常应该为0，请注意检查`,
      },
      localeOnly: {
        counts: excludeKey2.size,
        remarks: `${standard}中有但commonUsed && unCommonUsed && keepKeys没有的key，注意清除冗余key`,
      },
    });
    console.log(
      `执行结束，耗时${
        (Date.now() - startTimestamp) / 1000
      }秒，详细报告见.neeko/diff.json`,
    );
    // 创建.neeko目录
    if (!fs.existsSync(PROJECT_CONFIG.dir)) fs.mkdirSync(PROJECT_CONFIG.dir);
    fs.writeFileSync(
      path.join(PROJECT_CONFIG.dir, 'diff.json'),
      JSON.stringify(
        {
          projectOnly: Array.from(excludeKey).sort(),
          unCommonUsed: Array.from(unCommonProjectUsedKeys).sort(),
          keepKeys: Array.from(keepKeys).sort(),
          localeOnly: Array.from(excludeKey2).sort(),
          localeOnlyString: Array.from(excludeKey2).sort().join('\n'),
        },
        null,
        2,
      ),
    );
  } catch (e) {
    console.error(e);
  }
};

module.exports = _diff;
