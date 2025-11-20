/*
 * @owner: vijay.zhou@kupotech.com
 */
import { isRTLLanguage } from '@utils';
import { useTranslation } from '@tools/i18n';

export default function useIsRTL() {
  const { i18n } = useTranslation();
  return isRTLLanguage(i18n.language);
}
