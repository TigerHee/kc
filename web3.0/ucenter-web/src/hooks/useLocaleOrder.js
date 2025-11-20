/**
 * Owner: willen@kupotech.com
 */
import { basename, currentLang as currentLocale } from '@kucoin-base/i18n';
import { DEFAULT_LANG, languages } from 'config/base';
import useLocaleChange from 'hooks/useLocaleChange';
import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { getLocaleFromBrowser, needConfirmLang } from 'tools/i18n';
import searchToJson from 'utils/searchToJson';
import storage from 'utils/storage';

const localeBasename = basename;

export default () => {
  const user = useSelector((state) => state.user.user);
  const changeLocale = useLocaleChange();

  React.useEffect(() => {
    //app进入的界面
    const confirmLang = needConfirmLang();
    if (!confirmLang) {
      // 是否是支持的语言：
      const localeSupported = _.some(languages, (lang) => {
        return lang === currentLocale;
      });
      if (!localeSupported) {
        return changeLocale(DEFAULT_LANG, true);
      }
      storage.setItem('lang', currentLocale);
      return;
    }
    if (typeof user !== 'undefined') {
      const query = searchToJson();
      const storageLang = storage.getItem('lang');
      // 语言顺序：用户语言，query参数，语言子路径，本地存储，浏览器语言
      let changeLang = user?.language || query?.lang;
      if (!changeLang) {
        //英文路径
        if (!localeBasename) {
          // 浏览器语言
          changeLang = storageLang || getLocaleFromBrowser();
        } else {
          changeLang = currentLocale;
        }
      }
      const localeSupported = _.some(languages, (lang) => {
        return lang === changeLang;
      });
      if (!localeSupported) {
        // 不支持的语言设置成默认语言
        changeLang = DEFAULT_LANG;
        changeLocale(DEFAULT_LANG, true);
      } else if (changeLang !== currentLocale) {
        changeLocale(changeLang);
      }
      if (!storageLang || storageLang !== changeLang) {
        storage.setItem('lang', changeLang);
      }
      if (query?.lang && changeLang === currentLocale) {
        changeLocale(query.lang);
      }
    }
  }, [user, changeLocale]);
};
