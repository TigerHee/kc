/**
 * Owner: charles.yang@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui/emotion';
import { Drawer, Button } from '@kux/mui';

const WrapperDrawer = styled(Drawer)`
  width: 100%;
  padding: 0;
  border-radius: 12px 12px 0 0;
  min-height: 240px;
  .KuxModalHeader-root {
    height: 56px;
    padding: 0 16px;
  }
  .KuxModalHeader-title {
    font-size: 18px;
  }
  .KuxModalHeader-close {
    top: 11px;
    right: 16px;
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
`;

const DrawerContent = styled.div`
  padding: 16px 16px 0px 16px;
`;

const ButtonContent = styled.div`
  padding: 24px 16px 16px 16px;
`;

const AdaptiveModal = (props) => {
  const { open, okText, onOk, okButtonProps, onCancel, onClose, ...rest } = props;
  return (
    <WrapperDrawer back={false} anchor="bottom" show={open} onClose={onCancel || onClose} {...rest}>
      <DrawerContent>{props.children}</DrawerContent>
      {okText && onOk ? (
        <ButtonContent>
          <Button color="primary" fullWidth size="basic" onClick={onOk} {...okButtonProps}>
            {okText}
          </Button>
        </ButtonContent>
      ) : null}
    </WrapperDrawer>
  );
};

export default AdaptiveModal;
