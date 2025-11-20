/**
 * Owner: garuda@kupotech.com
 */

import React from 'react';

// import clsx from 'clsx';

import Button from '@mui/Button';

import { _t, styled, MARGIN_MODE_CROSS, MARGIN_MODE_ISOLATED } from '../../../builtinCommon';
import { TABS_LIQUIDATION } from '../../../config';
import { useCalcMarginMode, useMarginMode } from '../useCalcMarginMode';

const ButtonGroup = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  background: ${(props) => props.theme.colors.cover4};
  border-radius: 80px;
  margin-top: 12px;
  border-radius: 6px;
  padding: 2px;
`;

const ButtonItem = styled(Button)`
  flex: 1;
  height: 24px;
  padding: 6px 12px;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text60};
  background-color: transparent;
  border-radius: 6px;
  :hover {
    background-color: transparent;
    color: ${(props) => props.theme.colors.text};
  }
  &.mode-active {
    color: ${(props) => props.theme.colors.text};
    background-color: ${(props) => props.theme.colors.layer};
  }
`;

const ButtonType = ({ tabsActive }) => {
  const isLiquid = tabsActive === TABS_LIQUIDATION;
  const { onChange } = useCalcMarginMode();
  const active = useMarginMode();
  const isCrossActive = active === MARGIN_MODE_CROSS;
  const isIsolatedActive = active === MARGIN_MODE_ISOLATED;
  if (!isLiquid) {
    return null;
  }
  return (
    <ButtonGroup>
      <ButtonItem
        className={`cross-btn ${isCrossActive ? 'cross-active mode-active' : ''}`}
        variant="text"
        onClick={() => onChange(MARGIN_MODE_CROSS)}
      >
        {_t('futures.cross')}
      </ButtonItem>
      <ButtonItem
        className={`cross-btn ${isIsolatedActive ? 'isolated-active mode-active' : ''}`}
        variant="text"
        onClick={() => onChange(MARGIN_MODE_ISOLATED)}
      >
        {_t('futures.isolated')}
      </ButtonItem>
    </ButtonGroup>
  );
};

export default React.memo(ButtonType);
