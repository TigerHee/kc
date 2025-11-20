/**
 * Owner: mike@kupotech.com
 * 封装 Tooltip 消息展示，配置 TooltipProvider 使用
 */

import React, { useMemo } from 'react';
import { styled } from '@/style/emotion';

import InputWithToolTip from '@/components/InputWithTooltip';

import { useTooltip, useActiveTooltipCheck, useIsBigScreen } from './config';

const TooltipPlaceholder = styled.div`
  height: 1px;
  margin-bottom: -1px;
  position: absolute;
  bottom: 0;
  width: 100px;
  z-index: -1;
`;

const FormTooltip = ({ name }) => {
  const tooltipMap = useTooltip();
  const isUseTooltipCheck = useActiveTooltipCheck();
  const isBigScreen = useIsBigScreen();
  const currentTooltip = useMemo(() => (tooltipMap ? tooltipMap[name] : ''), [name, tooltipMap]);

  if (!isUseTooltipCheck) return null;
  const popperStyle = isBigScreen ? { zIndex: 999 } : {};
  return (
    <InputWithToolTip
      title={currentTooltip?.message && currentTooltip?.show ? currentTooltip?.message : ''}
      popperStyle={popperStyle}
    >
      <TooltipPlaceholder />
    </InputWithToolTip>
  );
};

export default React.memo(FormTooltip);
