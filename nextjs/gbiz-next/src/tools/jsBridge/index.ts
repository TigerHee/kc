/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2025-09-13 10:00:50
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2025-09-23 12:24:21
 * @FilePath: /gbiz-next/src/tools/jsBridge/index.ts
 * @Description: 只在浏览器环境下运行的 JsBridge
 */

// 创建一个只在客户端运行的 JsBridge
let JsBridge: any = null;
let KNBBridge: any = null;
let JumpBridge: any = null;
let ProxyBridge: any = null;
let BizLogin: any = null;
let BizUtils: any = null;

// 动态导入所有 bridge 模块
const loadJsBridge = async () => {
  // 确保只在客户端运行
  if (typeof window === 'undefined') {
    return null;
  }

  if (JsBridge && KNBBridge && JumpBridge && ProxyBridge && BizLogin && BizUtils) {
    return { JsBridge, KNBBridge, JumpBridge, ProxyBridge, BizLogin, BizUtils };
  }

  try {
    // 并行导入所有模块，gbiz-next 项目构建不会打包 @knb/native-bridge 模块，所有业务项目都需要添加到 package.json的dependencies中
    const [bridgeModule, knbModule, jumpModule, proxyModule, bizLoginModule, bizUtilsModule] = await Promise.all([
      import('@knb/native-bridge'),
      import('@knb/native-bridge/lib/KNBBridge.js'),
      import('@knb/native-bridge/lib/JumpBridge.js'),
      import('@knb/native-bridge/lib/ProxyBridge.js'),
      import('@knb/native-bridge/lib/biz/login.js'),
      import('@knb/native-bridge/lib/biz/utils.js')
    ]);

    JsBridge = bridgeModule.default;
    KNBBridge = knbModule;
    JumpBridge = jumpModule;
    ProxyBridge = proxyModule;
    BizLogin = bizLoginModule;
    BizUtils = bizUtilsModule;
    
    // import @knb/native-bridge 这个模块会自动 执行JsBridge.init(); 初始化 
   
    return { JsBridge, KNBBridge, JumpBridge, ProxyBridge, BizLogin, BizUtils };
  } catch (error) {
    console.warn('Failed to load JsBridge modules:', error);
    return null;
  }
};

// 安全的 listenNativeEvent 方法
const safeListenNativeEvent = {
  on: (event: string, callback: Function) => {
    if (typeof window === 'undefined') {
      console.warn('listenNativeEvent.on called in SSR environment');
      return;
    }
    
    loadJsBridge().then((modules) => {
      if (modules && modules.JsBridge && modules.JsBridge.listenNativeEvent) {
        modules.JsBridge.listenNativeEvent.on(event, callback);
      }
    });
  },
  
  off: (event: string, callback: Function) => {
    if (typeof window === 'undefined') {
      console.warn('listenNativeEvent.off called in SSR environment');
      return;
    }
    
    loadJsBridge().then((modules) => {
      if (modules && modules.JsBridge && modules.JsBridge.listenNativeEvent) {
        modules.JsBridge.listenNativeEvent.off(event, callback);
      }
    });
  },
  
  clear: (event: string) => {
    if (typeof window === 'undefined') {
      console.warn('listenNativeEvent.clear called in SSR environment');
      return;
    }
    
    loadJsBridge().then((modules) => {
      if (modules && modules.JsBridge && modules.JsBridge.listenNativeEvent) {
        modules.JsBridge.listenNativeEvent.clear(event);
      }
    });
  }
};

// 同步的 isApp 方法（用于组件渲染判断）
const isApp = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  // 如果已经加载了，直接返回
  if (JsBridge) {
    return JsBridge.isApp();
  }
  
  // 尝试同步检测是否在 app 环境中
  // 通过 userAgent 或其他方式检测
  const userAgent = navigator.userAgent;
  const isInApp = userAgent.includes('KuCoin') || 
                  userAgent.includes('Kucoin');
  
  return isInApp;
};

const api = {
  isAndroid() {
    if (typeof window === 'undefined') return false;
    const u = navigator.userAgent;
    return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
  },
  isIOS() {
    if (typeof window === 'undefined') return false;
    const u = navigator.userAgent;
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  },
  isIOSX() {
    if (typeof window === 'undefined') return false;
    return this.isIOS() && window.screen.height >= 812;
  },
};

// 通用的安全方法调用器
const createSafeMethod = (moduleName: string, methodName: string) => {
  return async (...args: any[]) => {
    if (typeof window === 'undefined') {
      console.warn(`${methodName} called in SSR environment`);
      return Promise.reject('SSR environment');
    }

    try {
      const modules = await loadJsBridge();
      if (!modules || !modules[moduleName]) {
        return Promise.reject(`${moduleName} not available`);
      }

      const method = modules[moduleName][methodName];
      if (typeof method !== 'function') {
        console.warn(`Method ${methodName} not found in ${moduleName}`);
        return Promise.reject(`Method ${methodName} not found`);
      }

      return method(...args);
    } catch (error) {
      console.warn(`Failed to call ${methodName}:`, error);
      return Promise.reject(error);
    }
  };
};
// 统一计算DCLTIME时间，给 onpagemount 桥方法使用，传给 APP 上报神策
export function initAppDclTime() {
  const isInApp = isApp();
  try {
    if (isInApp) {
      const entries = performance.getEntriesByType('navigation');
      if (entries.length > 0) {
        const navEntry = entries[0] as PerformanceNavigationTiming;
        window.DCLTIME = navEntry.domContentLoadedEventEnd - navEntry.startTime;
        console.log('DOMContentLoaded event time: ' + window.DCLTIME + ' ms');
      } else {
        window.DCLTIME =
          performance.timing.domContentLoadedEventEnd -
          performance.timing.navigationStart;
      }
    }
  } catch (e) {
    console.log('DOMContentLoaded error: ' + e);
  }
}
// 导出安全的 bridge 对象
export default {
  // 基础方法
  open: createSafeMethod('JsBridge', 'open'),
  isApp: isApp, // 保持同步版本
  listenNativeEvent: safeListenNativeEvent, // 这个需要特殊处理，保持原样
  
  // KNBBridge 方法 - 全部使用 createSafeMethod
  getAppVersion: createSafeMethod('KNBBridge', 'getAppVersion'),
  refreshAppSession: createSafeMethod('KNBBridge', 'refreshAppSession'),
  getAppInfo: createSafeMethod('KNBBridge', 'getAppInfo'),
  exitApp: createSafeMethod('KNBBridge', 'exitApp'),
  showToast: createSafeMethod('KNBBridge', 'showToast'),
  getFingerToken: createSafeMethod('KNBBridge', 'getFingerToken'),
  getPasteBoardContent: createSafeMethod('KNBBridge', 'getPasteBoardContent'),
  getPermission: createSafeMethod('KNBBridge', 'getPermission'),
  vibrate: createSafeMethod('KNBBridge', 'vibrate'),
  
  // JumpBridge 方法
  jump: createSafeMethod('JumpBridge', 'jump'),
  
  // ProxyBridge 方法
  requestApp: createSafeMethod('ProxyBridge', 'requestApp'),
  
  // biz 模块方法 - 需要特殊处理
  gotoAppLogin: createSafeMethod('BizLogin', 'gotoAppLogin'),
  compareVersion: createSafeMethod('BizUtils', 'compareVersion'),
  
  // 其他 API
  ...api,
};
