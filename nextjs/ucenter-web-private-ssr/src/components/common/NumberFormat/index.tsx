/**
 * Owner: solar@kupotech.com
 */
import { getCurrentLang } from 'kc-next/boot';
import { NumberFormat as OriginNumberFormat } from '@kux/mui';
import { isNil } from 'lodash-es';

export default function NumberFormat({ children, ...props }) {
  const currentLang = getCurrentLang();
  if (isNil(children)) return null;
  const _props = { ...props, lang: currentLang };
  return <OriginNumberFormat {..._props}>{children}</OriginNumberFormat>;
}
