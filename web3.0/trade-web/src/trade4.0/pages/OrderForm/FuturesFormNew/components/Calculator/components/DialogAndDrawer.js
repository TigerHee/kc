/**
 * Owner: garuda@kupotech.com
 */
import React, { forwardRef } from 'react';

import { Dialog, MDrawer, useResponsive } from '@kux/mui';

import { styled } from '../../../builtinCommon';

const StyledDialog = styled(Dialog)`
  .KuxDialog-body {
    width: 640px;
    max-width: 640px;
    height: 640px;
  }
  .KuxModalHeader-root {
    min-height: auto;
    height: auto;
    padding: 32px 32px 16px;
  }
  .KuxDialog-content {
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const MDrawerWrapper = styled(MDrawer)`
  width: 100%;
  height: 100% !important;
`;

const MuiDrawer = forwardRef((props, ref) => {
  const { sm } = useResponsive();
  const _show = props.open || props.show;
  const _onClose = props.onCancel || props.onClose;

  const commonProps = {
    open: _show,
    show: _show,
    onClose: _onClose,
    onCancel: _onClose,
  };

  return sm ? (
    <StyledDialog ref={ref} {...props} {...commonProps} />
  ) : (
    <MDrawerWrapper ref={ref} {...props} {...commonProps} anchor="right" />
  );
});

export default React.memo(MuiDrawer);
