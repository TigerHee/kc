/**
 * Owner: solar@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { NumberFormat as OriginNumberFormat } from '@kux/mui';
import isNil from 'lodash/isNil';

export default function NumberFormat({ children, ...props }) {
  const { currentLang } = useLocale();
  if (isNil(children)) return null;
  const _props = { ...props, lang: currentLang };
  return <OriginNumberFormat {..._props}>{children}</OriginNumberFormat>;
}
