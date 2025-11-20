/**
 * Owner: solar@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { NumberFormat as OriginNumberFormat } from '@kux/mui';
import { isNil } from 'lodash-es';

export default function NumberFormat({ children, ...props }) {
  const { currentLang } = useLocale();
  if (isNil(children)) return null;
  const _props = { ...props, lang: currentLang };
  return <OriginNumberFormat {..._props}>{children}</OriginNumberFormat>;
}
