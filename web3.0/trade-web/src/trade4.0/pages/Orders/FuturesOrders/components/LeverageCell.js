/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo } from 'react';
import { _t } from 'utils/lang';
import Decimal from 'decimal.js';
import { styled, fx } from '@/style/emotion';

const MultipleContent = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  ${fx.paddingLeft('4')}
  ${fx.paddingRight('4')}
  ${fx.lineHeight('16')}
  ${(props) => fx.color(props, 'text60')}
  ${(props) => fx.backgroundColor(props, 'cover8')}
  ${fx.borderRadius('4px')}
  ${fx.marginLeft(0)}
  ${(props) => fx.marginRight(props.isSingle ? '0' : '6')}
  width: fit-content;
  height: fit-content;
`;

const LeverageCell = ({ realLeverage, isSingle }) => {
  return (
    <MultipleContent isSingle={isSingle}>{Decimal(realLeverage || 0).toFixed(2)}x</MultipleContent>
  );
};

export default memo(LeverageCell);
