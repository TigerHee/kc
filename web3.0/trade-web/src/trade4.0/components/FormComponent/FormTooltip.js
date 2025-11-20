/**
 * Owner: garuda@kupotech.com
 * 封装 Tooltip 消息展示，配置 TooltipProvider 使用
 */

import React, { useMemo } from 'react';
import { styled } from '@/style/emotion';

import InputWithToolTip from '@/components/InputWithTooltip';

import { useTooltip } from './config';

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

  const currentTooltip = useMemo(() => (tooltipMap ? tooltipMap[name] : ''), [name, tooltipMap]);

  return (
    <InputWithToolTip
      title={currentTooltip?.message && currentTooltip?.show ? currentTooltip?.message : ''}
    >
      <TooltipPlaceholder />
    </InputWithToolTip>
  );
};

export default React.memo(FormTooltip);
