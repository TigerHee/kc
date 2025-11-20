/*
 * @Owner: Clyne@kupotech.com
 */
import React, { memo } from 'react';
import useI18n from '@/hooks/futures/useI18n';

const Side = ({ side, className }) => {
  const { _t } = useI18n();
  const i18nPrefix = 'symbol.side.';
  const sideLower = `${side}`.toLowerCase();
  if (!side) {
    return null;
  }
  const sideText = _t(i18nPrefix + sideLower);
  return <div className={`symbol-side ${className} ${sideLower}`}>{sideText}</div>;
};

export default memo(Side);
