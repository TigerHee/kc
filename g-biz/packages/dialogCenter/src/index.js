/**
 * Owner: willen@kupotech.com
 */
import { ThemeProvider, EmotionCacheProvider } from '@kux/mui';
import { isRTLLanguage } from '@utils';
import { useTranslation } from '@tools/i18n';
import { useMemo } from 'react';
import RegGuide from './RegGuide';

const DialogCenter = ({ type, theme }) => {
  const { i18n } = useTranslation();

  const DialogComp = useMemo(() => {
    return {
      // 注册引导弹窗
      'REG_GUIDE': RegGuide,
    }[type];
  }, [type]);
  if (!DialogComp) return null;

  return (
    <ThemeProvider theme={theme || 'light'}>
      <EmotionCacheProvider isRTL={isRTLLanguage(i18n.language)}>
        <DialogComp type={type} />
      </EmotionCacheProvider>
    </ThemeProvider>
  );
};

export default DialogCenter;
