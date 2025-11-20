/**
 * Owner: willen@kupotech.com
 */
import { EmotionCacheProvider } from '@kux/mui';
import { isRTLLanguage } from '@utils';
import { useLang } from '../hookTool';

const RootEmotionCacheProvider = ({ children }) => {
  const { i18n = {} } = useLang();
  const { language } = i18n;

  return <EmotionCacheProvider isRTL={isRTLLanguage(language)}>{children}</EmotionCacheProvider>;
};

export default RootEmotionCacheProvider;
