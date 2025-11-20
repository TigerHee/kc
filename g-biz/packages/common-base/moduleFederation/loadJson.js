/*
 * @Owner: elliott.su@kupotech.com
 */
import { FAILURE, LOADING, SUCCESS } from './const';

export class JsonLoader {
  constructor(url) {
    this.url = url;
    this.data = {};
    this.callbacks = [];
    this.status = LOADING;
    this.load();
  }

  static cache = {};

  // 添加回调
  add(callback) {
    if (this.callbacks.indexOf(callback) < 0) {
      this.callbacks.push(callback);
    }
  }

  // 执行回调
  emit(data) {
    this.callbacks.forEach((fn) => {
      fn && fn(data);
    });
  }

  // 加载资源
  async load() {
    try {
      const response = await fetch(this.url);
      const data = await response.json();
      this.data = data;
      this.status = SUCCESS;
      this.emit(data);
    } catch (error) {
      this.status = FAILURE;
      this.emit();
    }
  }
}
/**
 * 加载json资源
 * @param {string} url 资源地址
 * @param {function} callback 回调函数
 */
const loadJson = async (url, callback) => {
  const { cache } = JsonLoader;
  let loader = cache[url];

  // 如果不存在，则生成新实例
  if (!loader) {
    loader = new JsonLoader(url);
    cache[url] = loader;
  }
  // 加载中，push到队列
  if (loader.status === LOADING) {
    loader.add(callback);
    return;
  }
  // 加载成功
  if (loader.status === SUCCESS) {
    callback && callback(loader.data);
  }
  // 加载失败
  if (loader.status === FAILURE) {
    callback && callback();
  }
};

export default loadJson;
