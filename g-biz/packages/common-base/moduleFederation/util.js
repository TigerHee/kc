/*
 * @Owner: elliott.su@kupotech.com
 */
import loadJson from './loadJson';

// 维护一个以项目维度的模块联邦信息，保存项目名与mf-import-map.json映射
window._FEDERATION_ = {};

/**
 * 设置模块联邦全局信息（init只执行1次）
 * @param {string} name 项目名
 * @param {string} entry 项目入口
 */
function setEntry(name, entry) {
  window._FEDERATION_[name] = {
    entry,
  };
}

/**
 * 获取模块联邦信息
 * @param {string} name 项目名
 */
function getEntry(name) {
  return window._FEDERATION_[name];
}

/**
 * 单次注册模块联邦
 * @param {string} name 项目名
 * @param {string} entry 项目入口
 * @param {string} preload 选填，是否预加载资源
 */
export function registerRemote({ name, entry, preload }) {
  if (getEntry(name)) {
    return;
  }
  setEntry(name, entry);
  // 加载资源
  if (preload) {
    loadJson(getEntry(name).entry);
  }
}

/**
 * 加载json map文件，注册remoteEntry地址
 * @param {string} name 项目名
 */
export function loadRemoteModule(name) {
  return new Promise((resolve, reject) => {
    // 如果没有执行init，未注册，则直接返回错误
    if (!getEntry(name)) {
      reject(new Error('not register'));
      return;
    }

    loadJson(getEntry(name).entry, async (data) => {
      // json资源下载错误
      if (!data) {
        reject(new Error('map json url error'));
        return;
      }

      // json资源下载成功后注册
      window.System.addImportMap(data);

      // 注册成功后加载remoteEntry
      window.System.import(name)
        .then((res) => resolve(res))
        .catch((error) => reject(new Error('remote js url error', error)));
    });
  });
}

/**
 * @description: 拆分包名字, 格式name/module，如trade-web/List 拆成trade-web和List
 * @param {string} remotePackage
 */
export function splitPackageName(remotePackage) {
  const [name, module] = remotePackage.split('/');
  return [name, module];
}
