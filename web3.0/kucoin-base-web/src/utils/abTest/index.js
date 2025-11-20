/*
 * @Date: 2024-06-05 13:59:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-01-23 11:14:10
 */
// import allSettled from '../allSettled';
import isFunction from '../isFunction';
import { checkIsMatchUrlWithLocation } from './util';

class ABTestApplicationController {
  constructor() {
    this.data = {};
  }

  updateData(key, value) {
    this.data[key] = value;
  }

  /**
   * 匹配当前位置和目标URLs，如果匹配成功，则拉取 AB 测试配置。
   * @param {Object} params - 参数对象
   * @param {string|string[]} params.targetUrl - 用于匹配当前位置的URL或URL模式
   * @param {string} params.key - AB测试数据的唯一标识键
   * @param {string} params.matchCondi - 自定义match条件 有这个就不用targetUrl
   * @param {function(): Promise<boolean>} params.fetchAbTestConfig - 调用以获取AB测试配置的函数，返回 Promise 解析为布尔值
   * @returns {Promise<void>} 完成 AB 测试配置拉取并更新后解析的 Promise，如果没有匹配或没有提供拉取函数，则不执行任何操作
   */
  async matchUrlAndPullAbTestConfig({ targetUrl, key, matchCondi, fetchAbTestConfig }) {
    let isMatch = false;
    if (matchCondi && isFunction(matchCondi)) {
      isMatch = matchCondi(this.location);
    } else {
      isMatch = checkIsMatchUrlWithLocation(this.location, targetUrl);
    }
    if (!isMatch || !fetchAbTestConfig) return;
    try {
      const abTestValue = await fetchAbTestConfig();
      this.updateData(key, abTestValue);
    } catch (error) {
      console.log(`Error while pulling AB test config for "${key}":`, error);
    }
  }

  async init(location) {
    this.location = location;

    // await allSettled([
    //   this.matchUrlAndPullAbTestConfig({
    //     key: 'optionV2',
    //     fetchAbTestConfig: async () => await getEnableOptionV2(),
    //     targetUrl: ['/option-simple', '/order/options'],
    //   }),
    // ]);
  }

  get(key) {
    return this.data[key];
  }
}

export const aBTestApplicationController = new ABTestApplicationController();
