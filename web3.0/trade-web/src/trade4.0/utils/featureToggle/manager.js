/**
 * Owner: garuda@kupotech.com
 */

import storage from 'utils/storage';

// 考虑后续开关可能会继续扩展，抽象成一个 class 管理方法
class FeatureToggleManager {
  constructor(config) {
    this.config = config;
  }

  isFeatureEnabled(key) {
    // 检查 localStorage 中是否有强制开关设置
    const forcedState = storage.getItem(`trade-feature-toggle-${key}`);
    if (forcedState !== null) {
      return forcedState === 'true';
    }
    // 检查是否需要校验 AB
    if (this.config[key]?.sensorsAB) {
      const sensorsAB = this.config[key].sensorsAB;
      console.log(sensorsAB);
      return window[sensorsAB?.key] === sensorsAB?.valueStr;
    }
    // 否则，返回配置中的默认值
    return this.config[key]?.toggle || false;
  }

  setFeatureState = (key, state) => {
    storage.setItem(`trade-feature-toggle-${key}`, state);
  };

  clearFeatureState = (key) => {
    storage.removeItem(`trade-feature-toggle-${key}`);
  };
}
const tradeFeatureMap = {};
// 只初始化一次
FeatureToggleManager.getInstance = (eventName, props) => {
  if (tradeFeatureMap[eventName]) {
    return tradeFeatureMap[eventName];
  }
  tradeFeatureMap[eventName] = new FeatureToggleManager(props);
  return tradeFeatureMap[eventName];
};

export default FeatureToggleManager;
