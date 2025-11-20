/**
 * Owner: willen@kupotech.com
 */
import { getUserAgentInfo } from 'helper';

export const ADA_URL = 'https://assets.staticimg.com/natasha/npm/ada@1.0.0/ada.min.js';

// TODO: TH TR
export const loadAdaScript = (src) => {
  window.adaSettings = {
    handle: 'kucoin',
    cluster: 'eu',
    crossWindowPersistence: true,
  };
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.id = '__ada';
    document.body.appendChild(script);
    script.onload = resolve;
    script.onerror = reject;
  });
};

/**
 * 设置ada 用户元信息
 * @param {*} user  用户数据 obj
 */
export const setAdaMetaFields = (user = {}) => {
  const winNav = window.navigator;
  const { systemName, systemVersion: System, networkType, browser } = getUserAgentInfo();
  const ScreenSize = screen.width + 'x' + screen.height;
  const {
    nickname: Nickname,
    uid: UID,
    phoneValidate: PhoneValidate,
    language,
    userLabel,
    emailValidate,
  } = user || {};
  // 本地时间和东八区时区的时间差，单位为分钟
  const timeZone = new Date().getTimezoneOffset() + 480;
  const diffTime = (-timeZone * 60 * 1000).toString(); // 转化为毫秒
  const visit_note = `UID: ${UID}\n IP: null\n Platform: ${systemName} ${browser}\n Version: null\n Language-device: ${winNav?.language}\n Language-kucoin: ${language}\n Channel: null\n System: ${System} \n Model: null \n ScreenSize: ${ScreenSize}\n NetworkType: ${networkType} \n DeviceInfo:${winNav?.userAgent} \n DeviceNo: null\n Operator: null \n Signature(SHA1): null\n`;
  const adaFields = {
    source: 'support',
    visit_note,
    UID,
    Nickname,
    PhoneValidate,
    userLabel: userLabel?.label,
    text: userLabel?.text,
    EmailValidate: Boolean(emailValidate),
    'time-zone': diffTime,
  };
  // 设置元变量信息
  window.adaEmbed?.setMetaFields(adaFields);
};

/**
 * 移除ada
 */
export const removeAda = () => {
  return new Promise((resolve, reject) => {
    window.adaEmbed?.setMetaFields({});
    window.adaEmbed?.stop();
    const adaScript = document.getElementById('__ada');
    const adaEmbed = document.querySelector('script[src*="/client/b369b05/index.js"]');
    adaEmbed && document.head.removeChild(adaEmbed);
    adaScript && document.body.removeChild(adaScript);
  });
};
