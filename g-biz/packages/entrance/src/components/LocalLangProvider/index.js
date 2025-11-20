/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { LocalLangContext } from '../../common/context';

export default function LocalLangProvider(props) {
  const { lang, children } = props;
  const currentLang = lang.locale;
  useEffect(() => {
    intl.init({ currentLocale: currentLang, locales: { [currentLang]: lang } });
  }, [currentLang]);
  return (
    <LocalLangContext.Provider value={{ currentLang, lang }}>{children}</LocalLangContext.Provider>
  );
}
