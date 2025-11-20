import isNil from 'lodash/isNil';

/**
 * 获取网络请求类型
 */
export const getNetworkType = () => {
  const { userAgent } = navigator;
  let networkStr = userAgent.match(/NetType\/\w+/)
    ? userAgent.match(/NetType\/\w+/)[0]
    : 'NetType/other';
  networkStr = networkStr.toLowerCase().replace('nettype/', '');
  let networkType;
  switch (networkStr) {
    case 'wifi':
      networkType = 'wifi';
      break;
    case '5g':
      networkType = '5g';
      break;
    case '4g':
      networkType = '4g';
      break;
    case '3g':
      networkType = '3g';
      break;
    case '3gnet':
      networkType = '3g';
      break;
    case '2g':
      networkType = '2g';
      break;
    default:
      networkType = 'other';
  }
  return networkType;
};

/**
 * 获取浏览器设备信息
 */
export const getUserAgentInfo = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  let name = 'Unknown';
  let version = 'Unknown';
  const browserInfo = {
    type: 'Unknown',
    versions: 'Unknown',
  };
  const networkType = getNetworkType();

  if (userAgent.indexOf('win') > -1) {
    name = 'Windows';
    if (userAgent.indexOf('windows nt 5.0') > -1) {
      version = 'Windows 2000';
    } else if (
      userAgent.indexOf('windows nt 5.1') > -1 ||
      userAgent.indexOf('windows nt 5.2') > -1
    ) {
      version = 'Windows XP';
    } else if (userAgent.indexOf('windows nt 6.0') > -1) {
      version = 'Windows Vista';
    } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
      version = 'Windows 7';
    } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
      version = 'Windows 8';
    } else if (userAgent.indexOf('windows nt 6.3') > -1) {
      version = 'Windows 8.1';
    } else if (
      userAgent.indexOf('windows nt 6.2') > -1 ||
      userAgent.indexOf('windows nt 10.0') > -1
    ) {
      version = 'Windows 10';
    } else {
      version = 'Unknown';
    }
  } else if (userAgent.match(/iphone/i)) {
    name = 'iPhone';
    version = 'ios';
  } else if (userAgent.match(/Ipad/i)) {
    name = 'iPad';
    version = 'ios';
  } else if (
    userAgent.indexOf('mac') > -1 ||
    !!userAgent.match(/Macintosh/i) ||
    userAgent.match(/MacIntel/i)
  ) {
    name = 'Mac';
    version = 'macOS';
  } else if (
    userAgent.indexOf('x11') > -1 ||
    userAgent.indexOf('unix') > -1 ||
    userAgent.indexOf('sunname') > -1 ||
    userAgent.indexOf('bsd') > -1
  ) {
    name = 'Unix';
    version = 'Unix';
  } else if (userAgent.indexOf('linux') > -1) {
    if (userAgent.indexOf('android') > -1) {
      name = 'Android';
      version = 'Android';
    } else {
      name = 'Linux';
      version = 'Linux';
    }
  } else {
    name = 'Unknown';
    version = 'Unknown';
  }
  const browserArray = {
    IE: window.ActiveXObject || 'ActiveXObject' in window, // IE
    Chrome: userAgent.indexOf('chrome') > -1 && userAgent.indexOf('safari') > -1, // Chrome浏览器
    Firefox: userAgent.indexOf('firefox') > -1, // 火狐浏览器
    Opera: userAgent.indexOf('opera') > -1, // Opera浏览器
    Safari: userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') === -1, // safari浏览器
    Edge: userAgent.indexOf('edge') > -1, // Edge浏览器
    QQBrowser: /qqbrowser/.test(userAgent), // qq浏览器
    WeixinBrowser: /MicroMessenger/i.test(userAgent), // 微信浏览器
  };
  // eslint-disable-next-line
  for (let i in browserArray) {
    if (browserArray[i]) {
      let versions = '';
      if (i === 'IE') {
        const matchTarget = userAgent.match(/(msie\s|trident.*rv:)([\w.]+)/);
        versions = matchTarget?.length >= 3 ? matchTarget[2] : null;
      } else if (i === 'Chrome') {
        // eslint-disable-next-line
        for (let mt in navigator.mimeTypes) {
          // 检测是否是360浏览器(测试只有pc端的360才起作用)
          if (navigator.mimeTypes[mt].type === 'application/360softmgrplugin') {
            i = '360';
          }
        }
        const matchTarget = userAgent.match(/chrome\/([\d.]+)/);
        versions = matchTarget?.length >= 2 ? matchTarget[1] : null;
      } else {
        let matchTarget = [];
        if (i === 'Firefox') {
          matchTarget = userAgent.match(/firefox\/([\d.]+)/);
        } else if (i === 'Opera') {
          matchTarget = userAgent.match(/opera\/([\d.]+)/);
        } else if (i === 'Safari') {
          matchTarget = userAgent.match(/version\/([\d.]+)/) || userAgent.match(/safari\/([\d.]+)/);
        } else if (i === 'Edge') {
          matchTarget = userAgent.match(/edge\/([\d.]+)/);
        } else if (i === 'QQBrowser') {
          matchTarget = userAgent.match(/qqbrowser\/([\d.]+)/);
        }
        versions = matchTarget?.length >= 2 ? matchTarget[1] : null;
      }

      browserInfo.type = i;
      browserInfo.versions = isNil(versions) ? '' : parseInt(versions, 10);
    }
  }
  const { type: browserType, versions: browserVersion } = browserInfo;
  const browser = `${browserType} ${browserVersion}`;
  const result = {
    systemName: name,
    systemVersion: version,
    browserType,
    browserVersion,
    browser,
    networkType,
  };
  return result;
};
