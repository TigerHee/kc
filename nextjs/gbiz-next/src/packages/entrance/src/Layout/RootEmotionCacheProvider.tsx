/**
 * Owner: sean.shi@kupotech.com
 */
import { EmotionCacheProvider } from '@kux/mui';
import { isRTLLanguage } from 'tools/i18n';
import { useLang } from '../hookTool';
import React from 'react';

interface RootEmotionCacheProviderProps {
  children: React.ReactNode;
}

const RootEmotionCacheProvider: React.FC<RootEmotionCacheProviderProps> = ({ children }) => {
  const { i18n = {} } = useLang() as { i18n: { language?: string } };
  const { language } = i18n;

  return <EmotionCacheProvider isRTL={isRTLLanguage(language!)}>{children}</EmotionCacheProvider>;
};

export default RootEmotionCacheProvider;
