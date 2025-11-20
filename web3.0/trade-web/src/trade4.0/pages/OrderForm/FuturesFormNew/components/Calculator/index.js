/**
 * Owner: garuda@kupotech.com
 */
import React, { useCallback } from 'react';

import { ICCalculatorOutlined } from '@kux/icons';

import CalculatorDialog from './CalculatorDialog';

import { CALCULATOR, styled, trackClick } from '../../builtinCommon';

import { useCalculatorOpen } from '../../hooks/useCalculatorProps';

const IconBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  background: ${(props) => props.theme.colors.cover4};
  border-radius: 8px;

  &:active {
    background: ${(props) => props.theme.colors.cover12};
  }
`;

const CalcIcon = styled(ICCalculatorOutlined)`
  width: 14px;
  height: 14px;
  color: ${(props) => props.theme.colors.icon};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const CalculatorBox = () => {
  const onCalculatorVisible = useCalculatorOpen();

  const handleOpenCalculator = useCallback(() => {
    onCalculatorVisible(true);
    trackClick([CALCULATOR, '1']);
  }, [onCalculatorVisible]);

  return (
    <>
      <IconBtn className={'futures-calculator-btn'} onClick={handleOpenCalculator}>
        <CalcIcon />
      </IconBtn>
      <CalculatorDialog />
    </>
  );
};

export default React.memo(CalculatorBox);
