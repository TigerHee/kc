/**
 * Owner: odan.ou@kupotech.com
 */

import { useEffect, useCallback, useState } from 'react';
import { getUserAgentInfo } from './helper';

export const AdaBot = (props) => {
  const { userInfo, isDev, source } = props;
  const [isAdaReady, setIsAdaReady] = useState(false);

  // 页面载入加载ada, app和h5不加载ada
  useEffect(() => {
    if (!isAdaReady) {
      loadAda();
    }
    return () => {
      if (isAdaReady) {
        unloadAda();
      }
    };
  }, [loadAda, unloadAda, isAdaReady]);

  // 卸载ada
  const unloadAda = useCallback(async () => {
    await new Promise(() => {
      window.adaEmbed?.setMetaFields({});
      window.adaEmbed?.stop();
      const adaScript = document.getElementById('__ada');
      const adaEmbed = document.querySelector('script[src*="/client/b369b05/index.js"]');
      adaEmbed && document.head.removeChild(adaEmbed);
      adaScript && document.body.removeChild(adaScript);
    });
    setIsAdaReady(false);
  }, []);

  // 加载ada
  const loadAda = useCallback(async () => {
    try {
      window.adaSettings = {
        handle: 'kucoin',
        cluster: 'eu',
        crossWindowPersistence: true,
      };
      const ADA_URL = 'https://assets.staticimg.com/natasha/npm/ada@1.0.0/ada.min.js';
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = ADA_URL;
        script.id = '__ada';
        document.body.appendChild(script);
        script.onload = resolve;
        script.onerror = reject;
      });
      setIsAdaReady(true);
    } catch (e) {
      console.error('Load ada failed!');
    }
  }, [isDev]);

  // ada 传递用户元变量信息
  useEffect(() => {
    if (isAdaReady) {
      const winNav = window.navigator;
      const { systemName, systemVersion: System, networkType, browser } = getUserAgentInfo();
      // eslint-disable-next-line
      const ScreenSize = screen.width + 'x' + screen.height;
      const {
        nickname: Nickname,
        uid: UID,
        phoneValidate: PhoneValidate,
        language,
        userLabel,
        emailValidate,
      } = userInfo || {};
      // 本地时间和东八区时区的时间差，单位为分钟
      const timeZone = new Date().getTimezoneOffset() + 480;
      const diffTime = (-timeZone * 60 * 1000).toString(); // 转化为毫秒
      const visit_note = `UID: ${UID}\n IP: null\n Platform: ${systemName} ${browser}\n Version: null\n Language-device: ${winNav?.language}\n Language-kucoin: ${language}\n Channel: null\n System: ${System} \n Model: null \n ScreenSize: ${ScreenSize}\n NetworkType: ${networkType} \n DeviceInfo:${winNav?.userAgent} \n DeviceNo: null\n Operator: null \n Signature(SHA1): null\n`;
      const adaFields = {
        source,
        visit_note,
        UID,
        Nickname,
        PhoneValidate,
        userLabel: userLabel?.label,
        text: userLabel?.text,
        EmailValidate: emailValidate,
        'time-zone': diffTime,
      };
      // 设置元变量信息
      window.adaEmbed?.setMetaFields(adaFields);
    }
  }, [isAdaReady, userInfo, source]);

  return null;
};
