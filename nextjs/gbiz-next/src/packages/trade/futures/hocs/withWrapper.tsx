/*
 * @owner: tank@kupotech.com
 */
import { CacheProvider } from '@kux/mui-next';
import React from 'react';
import { isRTLLanguage, useTranslation } from 'tools/i18n';

export default (Component: React.ComponentType<any>) => (props: any) => {
  const { i18n } = useTranslation('trade');

  return (
    <CacheProvider isRTL={isRTLLanguage(i18n.language)}>
      <Component {...props} />
    </CacheProvider>
  );
};
