/**
 * Owner: charles.yang@kupotech.com
 */
import React from 'react';
import { Drawer, MDialog } from '@kux/mui';
import { useMediaQuery } from '@kux/mui/hooks';

const AdaptiveDrawer = (props) => {
  const {
    open,
    show,
    okText,
    onOk,
    okButtonProps,
    onCancel,
    className = '',
    onClose,
    ...rest
  } = props;
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return (
    <>
      {isMobile ? (
        <MDialog
          className={`${className} adaptive-m-drawer`}
          back={false}
          footer={null}
          anchor="bottom"
          show={open || show}
          onClose={onCancel || onClose}
          {...rest}
        />
      ) : (
        <Drawer className={className} {...props} onClose={onCancel || onClose} />
      )}
    </>
  );
};

export default AdaptiveDrawer;
