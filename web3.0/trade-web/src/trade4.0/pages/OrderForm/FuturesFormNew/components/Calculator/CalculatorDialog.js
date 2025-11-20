/**
 * Owner: garuda@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';

import { useResponsive } from '@kux/mui';

import ButtonType from './components/ButtonType';
import CalcResult from './components/CalcResult';
import ClosePriceTab from './components/ClosePriceTab';
import Dialog from './components/DialogAndDrawer';
import LiquidationTab from './components/LiquidationTab';
import MarginMode from './components/MarginMode';
import ProfitsTab from './components/ProfitsTab';
import Slider from './components/Slider';
import Tabs from './components/Tabs';

import { EVENT_NAME } from './config';

import { useCalcMarginMode } from './useCalcMarginMode';
import { reset } from './useReset';

import { _t, evtEmitter, styled, TOOLTIP_EVENT_KEY } from '../../builtinCommon';

import { isOpenFuturesCross } from '../../builtinHooks';
import { TABS_CLOSE, TABS_LIQUIDATION, TABS_PROFIT } from '../../config';
import {
  useCalculatorVisible,
  useCalculatorOpen,
  useCalculatorTabsActive,
} from '../../hooks/useCalculatorProps';

const event = evtEmitter.getEvt();

const DialogContent = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  flex-direction: ${(props) => (props.isMobile ? 'column' : 'row')};
  padding: ${(props) => (props.isMobile ? '16px 16px 24px' : '24px 32px 32px')};
  margin-bottom: ${(props) => (props.isMobile ? '88px' : '0')};
  height: ${(props) => (props.isMobile ? 'auto' : '100%')};

  .ku-button-group {
    margin: 10px 0 0;
  }

  .KuxForm-itemError {
    line-height: 1.3;
  }
`;

const FormBox = styled.div`
  position: relative;
  max-width: ${(props) => (props.isMobile ? '100%' : '280px')};
`;

const ResultBox = styled.div`
  flex: 1;
  margin: ${(props) => (props.isMobile ? '0' : '0 0 0 16px')};
`;

const TABS_CONTENT = {
  [TABS_PROFIT]: <ProfitsTab />,
  [TABS_LIQUIDATION]: <LiquidationTab />,
  [TABS_CLOSE]: <ClosePriceTab />,
};

const CalculatorDialog = () => {
  const visible = useCalculatorVisible();
  const onCalculatorVisible = useCalculatorOpen();
  const { tabsActive } = useCalculatorTabsActive();
  const { xs, sm } = useResponsive();
  const { reset: marginModeReset } = useCalcMarginMode();

  const isMobile = useMemo(() => xs && !sm, [sm, xs]);

  const handleClose = useCallback(() => {
    // 关闭前，先清空 tooltip
    event.emit(`${TOOLTIP_EVENT_KEY}_${EVENT_NAME}`, { type: 'close', data: [] });
    onCalculatorVisible(false);
    setTimeout(() => {
      marginModeReset();
      reset();
    }, 300);
  }, [marginModeReset, onCalculatorVisible]);

  return (
    <Dialog
      title={_t('calculator.title')}
      back={false}
      maskClosable={false}
      open={visible}
      onClose={handleClose}
      footer={null}
    >
      <Tabs />
      <DialogContent isMobile={isMobile}>
        <FormBox isMobile={isMobile}>
          <ButtonType />
          {isOpenFuturesCross() ? <MarginMode tabsActive={tabsActive} /> : null}
          <Slider />
          {TABS_CONTENT[tabsActive]}
        </FormBox>
        <ResultBox isMobile={isMobile}>
          <CalcResult />
        </ResultBox>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(CalculatorDialog);
