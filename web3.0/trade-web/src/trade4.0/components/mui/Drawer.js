/*
 * owner: Borden@kupotech.com
 */
import React, { forwardRef } from 'react';
import { Drawer, MDrawer, useResponsive } from '@kux/mui';
import styled from '@emotion/styled';

export const StyledDrawer = styled(Drawer)`
  .KuxDrawer-content {
    padding: ${(props) => props.contentPadding};
  }
  .KuxModalHeader-close {
    right: 32px !important;
    left: auto !important;
  }
`;

const MuiDrawer = forwardRef((props, ref) => {
  const _show = props.open || props.show;
  const _onClose = props.onCancel || props.onClose;
  const { sm } = useResponsive();

  const commonProps = {
    open: _show,
    show: _show,
    onClose: _onClose,
    onCancel: _onClose,
  };

  return sm ? (
    <StyledDrawer ref={ref} {...props} {...commonProps} />
  ) : (
    <MDrawer ref={ref} {...props} {...commonProps} anchor="bottom" />
  );
});

export default MuiDrawer;

