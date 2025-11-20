/*
 * @Owner: Clyne@kupotech.com
 */
import React, { memo } from 'react';
import useI18n from '@/hooks/futures/useI18n';
import { CROSS, ISOLATED } from '../../NewPosition/config';

const MarginMode = ({ marginMode = ISOLATED, className }) => {
  const { _t } = useI18n();
  const marginType = marginMode === CROSS ? _t('futures.cross') : _t('futures.isolated');
  if (marginMode === undefined) {
    return null;
  }
  return <div className={`symbol-margin-mode ${className}`}>{marginType}</div>;
};

export default memo(MarginMode);
