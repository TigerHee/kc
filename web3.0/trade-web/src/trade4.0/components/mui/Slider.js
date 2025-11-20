/*
 * owner: brick.fan@kupotech.com
 */
import React, { forwardRef } from 'react';
import { Slider } from '@kux/mui';
import styled from '@emotion/styled';
import { useIsRTL } from '@/hooks/common/useLang';

const StyledSlider = styled(Slider)`
  .rc-slider-dot,
  .rc-slider-handle {
    background-color: ${({ dotColor, theme: { colors } }) =>
      dotColor || colors.layer} !important;
  }
`;

const MuiSlider = forwardRef((props, ref) => {
  const isRTL = useIsRTL();
  return <StyledSlider ref={ref} reverse={isRTL} {...props} />;
});

export default MuiSlider;
