/*
 * owner: borden@kupotech.com
 */
import React from 'react';
import { NumberFormat as MuiNumberFormat } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import { isNil } from 'lodash';

const NumberFormat = ({ children, ...otherProps }) => {
  const { i18n } = useTranslation();
  const { language } = i18n || {}; // 当前语言
  if (isNil(children)) return null;

  return (
    <MuiNumberFormat lang={language} {...otherProps}>
      {children}
    </MuiNumberFormat>
  );
};

export default NumberFormat;
