/*
 * @owner: borden@kupotech.com
 */
import React from 'react';
import { styled, Box, Spin } from '@kux/mui';
import { fade } from '@kux/mui/utils/colorManipulator';
import useIsRTL from '../../hooks/common/useIsRTL';

const Container = styled(Box)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  backdrop-filter: blur(4px);
  background-color: ${(props) => fade(props.theme.colors.overlay, 0.8)};
`;
const SpinLoading = styled(Spin)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: ${({ isRTL }) => `translate3d(${isRTL ? '' : '-'}50%, -50%, 0)`};
`;

const AbsoluteLoading = ({ size = 'basic', spinning, ...otherProps }) => {
  const isRTL = useIsRTL();
  return (
    <Container {...otherProps}>
      <SpinLoading size={size} isRTL={isRTL} spinning={Boolean(spinning)} />
    </Container>
  );
};

export default AbsoluteLoading;
