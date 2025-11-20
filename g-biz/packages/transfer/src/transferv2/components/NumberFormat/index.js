/*
 * Owner: solar@kupotech.com
 */
import { NumberFormat as OriginNumberFormat } from '@kux/mui';
import isNil from 'lodash/isNil';
import { useProps } from '../../hooks/props';

export default function NumberFormat({ children, ...props }) {
  const currentLang = useProps((state) => state.currentLang);
  if (isNil(children)) return null;
  const _props = { ...props, lang: currentLang };
  return <OriginNumberFormat {..._props}>{children}</OriginNumberFormat>;
}
