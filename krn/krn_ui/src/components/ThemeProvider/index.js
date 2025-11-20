/**
 * Owner: willen@kupotech.com
 */
import React, { useMemo, useState, useEffect } from 'react';
import { CurrentThemeContext } from 'context';
import theme from 'theme';
import registerAPI from 'utils/registerAPI';
import API from 'components/ThemeProvider/API';
import { Platform, I18nManager } from 'react-native';
import setCustomText from 'utils/setCustomText';
import setCustomTextInput from 'utils/setCustomTextInput';
import setCustomImage from 'utils/setCustomImage';
import { isRTLLanguage, SUPPORT_RELOAD_VERSION, SUPPORT_KCNB_FONT_VERSION } from 'utils/config';
import { compareVersion } from 'utils/helper';
import { commonBridge } from '@krn/bridge';

/**
 * @description:
 * @params {object} options {loadingIconSource: ''}
 * @return {*}
 */
const ThemeProvider = ({
  options = {},
  children,
  defaultTheme = 'light',
  EmotionProviderInstance,
  lang = 'en_US',
  appVersion = '',
  cstyle = 'true', // true-绿涨红跌，false-红涨绿跌
}) => {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  const [isThemeProviderReady, setThemeProviderReady] = useState(false);

  const currentThemeValue = useMemo(() => {
    return {
      currentTheme,
      setCurrentTheme,
      cstyle,
      options,
    };
  }, [currentTheme, cstyle, options]);

  const iosCustomTextProps = {
    style: { textAlign: 'left' },
    allowFontScaling: false,
  };
  const androidCustomTextProps = {
    style: { textAlign: 'left' },
    allowFontScaling: false,
  };

  // 未传入app版本号默认使用新字体
  // 新版本都统一使用KCNBFont-Regular字体
  const newFontsAvailable =
    !appVersion || compareVersion(appVersion, SUPPORT_KCNB_FONT_VERSION) >= 0;

  if (newFontsAvailable) {
    iosCustomTextProps.style.fontFamily = 'KCNBFont';
    androidCustomTextProps.style.fontFamily = 'KCNBFont';
  } else {
    iosCustomTextProps.style.fontFamily = 'Roboto-Regular';
  }

  // Setting default styles for all Text/TextInput components.
  setCustomText(
    Platform.OS === 'ios' ? iosCustomTextProps : androidCustomTextProps,
    newFontsAvailable,
  );
  setCustomTextInput(
    Platform.OS === 'ios' ? iosCustomTextProps : androidCustomTextProps,
    newFontsAvailable,
  );
  setCustomImage({
    style: { transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] },
  });

  // rtl布局切换
  useEffect(() => {
    const toggleRTL = (val) => {
      setThemeProviderReady(false);
      if (
        val !== I18nManager.isRTL &&
        compareVersion(appVersion, SUPPORT_RELOAD_VERSION) >= 0 &&
        commonBridge?.reload
      ) {
        I18nManager.forceRTL(val);
        commonBridge?.reload();
      } else {
        setThemeProviderReady(true);
      }
    };

    toggleRTL(isRTLLanguage(lang));
  }, [lang, appVersion]);

  return (
    <CurrentThemeContext.Provider value={currentThemeValue}>
      <EmotionProviderInstance theme={theme(currentTheme, cstyle, options)}>
        {isThemeProviderReady ? children : null}
      </EmotionProviderInstance>
    </CurrentThemeContext.Provider>
  );
};

registerAPI(ThemeProvider, API);
export default ThemeProvider;
