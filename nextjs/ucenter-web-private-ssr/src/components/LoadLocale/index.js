/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import React from 'react';

export const injectLocale = (WrappedComponent) => (props) => {
  const { currentLang, isRTL, isCN, isZh } = useLocale();

  return (
    <WrappedComponent
      {...props}
      lang={currentLang}
      currentLang={currentLang}
      isRTL={isRTL}
      isCN={isCN}
      isZh={isZh}
    />
  );
};
