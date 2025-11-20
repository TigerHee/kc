/**
 * Owner: garuda@kupotech.com
 * 调整杠杆的盒子
 */

import React, { useCallback, useMemo } from 'react';

import { ABC_CROSS_LEVERAGE, MARGIN_MODE_CROSS, styled, toFixed } from '../../builtinCommon';
import { getMarginMode, useLeverageDialog, useShowAbnormal } from '../../builtinHooks';
import { getSymbolInfo, useGetLeverage } from '../../hooks/useGetData';
import TriangleIconWrapper from '../TriangleIconWrapper';

const LevWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 1.3;
  cursor: pointer;
`;

const LevValueBox = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text};
  margin-left: 8px;
`;

const ConfigLeverage = ({ className = '' }) => {
  const leverage = useGetLeverage();
  const { openLeverageDialog } = useLeverageDialog();
  const showAbnormal = useShowAbnormal();
  const { symbol } = getSymbolInfo();

  const handleOpenLeverageDialog = useCallback(() => {
    openLeverageDialog({ symbol });
  }, [openLeverageDialog, symbol]);

  const marginMode = getMarginMode(symbol);

  const abnormalResult = useMemo(() => {
    return marginMode === MARGIN_MODE_CROSS
      ? showAbnormal({
          requiredKeys: [ABC_CROSS_LEVERAGE],
        })
      : false;
  }, [marginMode, showAbnormal]);

  return (
    <>
      <LevWrapper className={className} onClick={handleOpenLeverageDialog}>
        <LevValueBox>{abnormalResult || `${toFixed(leverage)(2)}x`}</LevValueBox>
        <TriangleIconWrapper />
      </LevWrapper>
    </>
  );
};

export default React.memo(ConfigLeverage);
