/*
 * owner: Borden@kupotech.com
 */
import React, { forwardRef } from 'react';
import styled from '@emotion/styled';
import { Spin } from '@kux/mui';

const StyledSpin = styled(Spin)`
  width: 100%;
  .KuxSpin-container {
    height: 100%;
  }
`;

const MuiSpin = forwardRef((props, ref) => {
  return <StyledSpin ref={ref} {...props} />;
});

MuiSpin.defaultProps = {
  size: 'small',
};

export default MuiSpin;
