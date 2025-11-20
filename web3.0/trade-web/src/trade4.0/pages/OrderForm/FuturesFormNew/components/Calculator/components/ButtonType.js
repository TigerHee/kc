/**
 * Owner: garuda@kupotech.com
 */

import React, { useMemo } from 'react';

import clsx from 'clsx';

import Button from '@mui/Button';

import { _t, styled } from '../../../builtinCommon';
import { BTN_BUY, BTN_SELL } from '../../../config';
import { useCalculatorBtnType } from '../../../hooks/useCalculatorProps';

const ButtonGroup = styled.div`
  display: inline-flex;
  width: 100%;
  align-items: center;
  background: ${(props) => props.theme.colors.cover2};
  border-radius: 80px;
`;

const ButtonItem = styled(Button)`
  padding: 0 12px;
  flex: 1;
  height: 36px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text60};
  &.button-active.primary-btn {
    background: ${(props) => props.theme.colors.primary};
    &:active {
      background: ${(props) => props.theme.colors.primary20};
    }
  }
  &.button-active {
    color: ${(props) => props.theme.colors.textEmphasis};
  }
`;

const ButtonType = () => {
  const { btnType, onBtnTypeChange } = useCalculatorBtnType();

  const isActiveBuy = useMemo(() => {
    return btnType === BTN_BUY;
  }, [btnType]);

  return (
    <ButtonGroup>
      <ButtonItem
        className={clsx('primary-btn', { 'button-active': isActiveBuy })}
        variant={isActiveBuy ? 'contained' : 'text'}
        type={isActiveBuy ? 'primary' : 'default'}
        onClick={() => onBtnTypeChange(BTN_BUY)}
      >
        {_t('trade.order.buy')}
      </ButtonItem>
      <ButtonItem
        className={!isActiveBuy ? 'button-active' : ''}
        variant={!isActiveBuy ? 'contained' : 'text'}
        type={!isActiveBuy ? 'secondary' : 'secondary'}
        onClick={() => onBtnTypeChange(BTN_SELL)}
      >
        {_t('trade.order.sell')}
      </ButtonItem>
    </ButtonGroup>
  );
};

export default React.memo(ButtonType);
