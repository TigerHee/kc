/*
 * @owner: tank@kupotech.com
 */
import React from 'react';
import { EmotionCacheProvider } from '@kux/mui';
import { isRTLLanguage } from '@utils';
import { useTranslation } from '@tools/i18n';

export default (Component: React.ComponentType<any>) => (props: any) => {
  const { i18n } = useTranslation();

  return (
    <EmotionCacheProvider isRTL={isRTLLanguage(i18n.language)}>
      <Component {...props} />
    </EmotionCacheProvider>
  );
};
