/**
 * Owner: solar@kupotech.com
 */
import React from 'react';
import isNil from 'lodash/isNil';
import { useSelector } from 'dva';
import { NumberFormat } from '@kux/mui';

export default function NumberFormatWithLang({ children, ...props }) {
  const currentLang = useSelector((state) => state.app.currentLang);
  if (isNil(children)) return null;
  const _props = { ...props, lang: currentLang };
  return <NumberFormat {..._props}>{children}</NumberFormat>;
}
