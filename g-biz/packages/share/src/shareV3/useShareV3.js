/**
 * Owner: gavin.liu1@kupotech.com
 */
import qs from 'query-string';
import { useState, useEffect, useMemo, useRef } from 'react';
import { getShareData, getPageConfigItems, CONFIG_ITEMS } from './apis';
import useLang from '../hookTool/useLang';

const DEFAULT_LANG = window._DEFAULT_LANG_ || 'en_US';

export const useShareV3 = () => {
  const [loading, setLoading] = useState(false);
  const [shareData, setShareData] = useState();
  const shareTextRef = useRef();
  const shareDataLatestRef = useRef();

  // ready
  const [isReady, setIsReady] = useState(false);

  // i18n
  const { i18n, t: _t } = useLang();
  const { language: currentLang } = i18n || {};
  const splitByZeroString = currentLang !== DEFAULT_LANG;

  const initData = async () => {
    try {
      setLoading(true);
      const tasks = [
        async () => getShareData(),
        async () =>
          getPageConfigItems({
            businessLine: 'toc',
            codes: CONFIG_ITEMS.SharePosterTxt,
            lang: currentLang || DEFAULT_LANG,
          }),
      ];
      const [shareDataRes, configItemsRes] = await Promise.all(tasks.map((task) => task()));
      // FIXME: 由于各个地方重渲染机制、次数不同，需要留一份 latest 的最新数据给过早的渲染出图使用
      setShareData(shareDataRes?.data);
      shareDataLatestRef.current = shareDataRes?.data;
      const properties = configItemsRes?.data?.properties || [];
      const shareTextObject = properties.find((i) => {
        return i?.property === CONFIG_ITEMS.SharePosterTxt;
      });
      // FIXME: 想办法让文字 2 行省略
      if (shareTextObject?.value?.length) {
        shareTextObject.value = measureAndCutText(shareTextObject.value);
      }
      shareTextRef.current = shareTextObject;
      setIsReady(true);
    } catch {
      // pass
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, [currentLang]);

  function getSingleLineWidth() {
    switch (currentLang) {
      case 'ru_RU':
        return 182;
      case 'zh_HK':
        return 200;
      default:
        return 190;
    }
  }
  function measureAndCutText(text) {
    if (!text?.length) {
      return text;
    }
    const clearReturn = (str) => {
      return str.replace(/[\r\n]/g, '');
    };
    text = clearReturn(text);
    try {
      const { width } = renderElementThenMeasure(text);
      const maxLength = getSingleLineWidth() * 2;
      if (width > maxLength) {
        const cutLength = Math.floor((maxLength / width) * text.length);
        return `${text.slice(0, cutLength)}...`;
      }
      return text;
    } catch {
      return text;
    }
  }
  function isSecondLines(text) {
    if (!text?.length) {
      return false;
    }
    try {
      const { width } = renderElementThenMeasure(text);
      if (width > getSingleLineWidth()) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // 统一 rcode
  const updateToShareV3UniversalRcode = (originLink) => {
    const newRcode = shareDataLatestRef.current?.referralCode;
    if (newRcode?.length && originLink?.length) {
      const parsed = qs.parseUrl(originLink);
      if (parsed?.query?.rcode?.length) {
        parsed.query.rcode = newRcode;
        return qs.stringifyUrl(parsed);
      }
      // 特殊处理 /r/rf/{rcode}
      if (parsed?.url?.includes('/r/rf/')) {
        parsed.url = parsed.url.replace(/\/r\/rf\/\w+/, `/r/rf/${newRcode}`);
        return qs.stringifyUrl(parsed);
      }
      // /r/af/{rcode} 暂时不处理
    }
    return originLink;
  };

  // 统一图片标题
  const updateToShareV3UniversalTexts = (originTexts, opts = {}) => {
    const getImageTitle = () => {
      const shareLink = opts?.shareLink;
      // FIXME: 合伙人特殊逻辑，因为合伙人可能有多个不同的 rcode 可以自己选用，所以优先用合伙人自己的。
      const isAFScene = () => {
        if (!shareLink?.length) {
          return false;
        }
        return shareLink?.includes('/r/af/');
      };
      const isAF = isAFScene();
      const getAFRcode = () => {
        const parsed = qs.parseUrl(shareLink);
        const url = parsed?.url || '';
        if (url?.length) {
          const rcode = /\/r\/af\/(\w+)/.exec(url)?.[1];
          return rcode;
        }
      };
      /** 保持展示传入的rcode */
      const keepRcode = opts?.keepV2Rcode || opts?.keepV1Rcode;
      const shareText = shareTextRef.current;
      const fallbackRcode = keepRcode?.length
        ? keepRcode
        : shareDataLatestRef?.current?.referralCode;
      const mainTitle = shareText?.value || _t('69ti912QyqQK3RLThoqqNL');
      const rcode = isAF ? getAFRcode() || fallbackRcode : fallbackRcode;
      // 后台优先
      let subTitle = shareText?.backupValues?.text;
      if (!subTitle?.length) {
        // 登录用户：邀请码: {rcode}
        if (rcode?.length) {
          const text = _t('4EhrZujhYTKtPmKwo99tBr');
          if (text?.includes('{rcode}')) {
            subTitle = text.replace('{rcode}', rcode);
          } else {
            subTitle = text;
          }
        } else {
          // 兜底
          subTitle = _t('h2RhjtaW236Cy1ofAMdsY7', { num: 8200 });
        }
      } else if (subTitle?.includes('{rcode}')) {
        if (rcode?.length) {
          subTitle = subTitle.replace('{rcode}', rcode);
        } else {
          // 如果因为某些情况来不及替换了，兜底
          subTitle = _t('h2RhjtaW236Cy1ofAMdsY7', { num: 8200 });
        }
      }
      return {
        mainTitle,
        subTitle,
      };
    };
    if (Array.isArray(originTexts)) {
      const titleInfo = getImageTitle();
      const hasMainTitle = originTexts?.[0]?.text?.length;
      const hasSubTitle = originTexts?.[1]?.text?.length;
      let isTitleSecondLines = false;
      const needOffsetPx = 4;
      if (hasMainTitle) {
        const textObj = originTexts[0];
        const isSecond = isSecondLines(titleInfo.mainTitle);
        isTitleSecondLines = isSecond;
        textObj.text = titleInfo.mainTitle;
        // normalize
        textObj.x = 60;
        textObj.y = 615;
        // multi lines handle
        if (isSecond) {
          // expand line height
          textObj.lineHeight = 10;
          // ↑ move y
          textObj.y -= needOffsetPx;
        } else {
          // single line
          textObj.lineHeight = 5;
          // ↓ move y
          textObj.y += needOffsetPx;
        }
      }
      if (hasSubTitle) {
        const textObj = originTexts[1];
        textObj.text = titleInfo.subTitle;
        // normalize
        textObj.x = 60;
        textObj.y = 645;
        // multi lines handle
        if (isTitleSecondLines) {
          // ↓ move y
          textObj.y += needOffsetPx;
        } else {
          // single line
          // ↑ move y
          textObj.y -= needOffsetPx;
        }
      }
    }
    return originTexts;
  };

  // ads for carousel component
  const ads = useMemo(() => {
    return shareData?.ads?.data || {};
  }, [shareData]);

  return {
    loading,
    shareData,
    isReady,
    ads,
    updateToShareV3UniversalRcode,
    updateToShareV3UniversalTexts,
    currentLang,
    splitByZeroString,
  };
};

function renderElementThenMeasure(text) {
  const elm = document.createElement('div');
  elm.style.position = 'absolute';
  elm.style.top = '-9999px';
  elm.style.left = '-9999px';
  elm.style.opacity = 0;
  elm.style.fontSize = '14px';
  elm.innerText = text;
  document.body.appendChild(elm);
  const rect = elm?.getBoundingClientRect?.();
  const width = rect?.width || 0;
  document.body.removeChild(elm);
  return {
    width,
  };
}
