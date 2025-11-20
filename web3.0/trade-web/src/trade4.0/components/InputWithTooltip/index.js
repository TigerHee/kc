/**
 * Owner: borden@kupotech.com
 */

import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import TooltipWrapper from '@/components/TooltipWrapper';

const StyledTooltipWrapper = styled(TooltipWrapper)`
  width: 100%;
`;

const InputWithToolTip = (props) => {
  const { title, disabled, children, hideToolTip, ...otherProps } = props;
  const titleRef = useRef(title);

  useEffect(() => {
    // 确保关闭时不会立马把内容移除，保证关闭效果的连续性
    titleRef.current = title;
  }, [title]);
  const open = !disabled && !!title && !hideToolTip;
  return (
    <StyledTooltipWrapper
      isUsePc
      size="small"
      title={open ? title : titleRef.current}
      placement="top"
      open={open}
      {...otherProps}
    >
      {children}
    </StyledTooltipWrapper>
  );
};

export default React.memo(InputWithToolTip);
