import React from 'react';
import { useTranslation, Trans as OriginTrans, TransProps } from 'tools/i18n';
import { getCurrentLang } from 'kc-next/i18n';
import { RTL_LANGUAGES } from 'config/base';

export default () => {
  const currentLang = getCurrentLang();
  const { t } = useTranslation('verification');

  const Trans = (props: TransProps) => React.createElement(OriginTrans, { ...props, ns: 'verification' });

  return {
    t,
    currentLang,
    isRTL: RTL_LANGUAGES.includes(currentLang),  
    Trans,
  };
}