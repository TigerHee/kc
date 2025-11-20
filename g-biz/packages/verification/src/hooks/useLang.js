/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useTranslation } from '@tools/i18n';

export default function useLang() {
  const { t, i18n } = useTranslation('verification');
  return { _t: t, i18n };
}
