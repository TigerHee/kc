/*
 * owner: Borden@kupotech.com
 */
import React, { useEffect, forwardRef } from 'react';
import { isFunction } from 'lodash';
import { styled, Dialog, MDialog, useResponsive, useEventCallback } from '@kux/mui';
import { checkIsMobile } from '../../utils/tools';

const isMobile = checkIsMobile();

const MDialogPro = styled(MDialog)`
  height: ${(props) => props.height};
  .KuxDrawer-content {
    display: flex;
    flex-direction: column;
  }
  .KuxMDialog-content {
    height: 100%;
    color: ${(props) => props.theme.colors.text60};
    padding: ${(props) => props.contentPadding || 0};
  }
`;
const StyledDialog = styled(Dialog)`
  .KuxModalHeader-close {
    right: 32px !important;
    left: auto !important;
  }
  ${(props) => {
    if (props.size === 'xlarge') {
      return `
        padding-left: 40px;
        padding-right: 40px;
        .KuxDialog-body {
          max-width: 1440px;
        }
      `;
    }
  }}
`;

const MuiDialog = forwardRef((props, ref) => {
  const {
    open,
    show,
    onOk,
    height,
    onClose,
    onCancel,
    keyboard,
    contentPadding,
    centeredFooterButton,
    ...otherProps
  } = props;
  const _show = open || show;
  const _onClose = onCancel || onClose;

  const { sm } = useResponsive();

  const commonProps = {
    ref,
    onOk,
    open: _show,
    show: _show,
    onClose: _onClose,
    onCancel: _onClose,
  };

  useEffect(() => {
    if (!isMobile && _show && keyboard) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      if (!isMobile && _show && keyboard) {
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [isMobile, _show, keyboard, handleKeyDown]);

  const handleKeyDown = useEventCallback((e) => {
    if (e?.keyCode === 13) {
      if (isFunction(onOk)) onOk();
    } else if (e?.keyCode === 27) {
      if (isFunction(_onClose)) _onClose();
    }
  });

  return sm ? (
    <StyledDialog
      centeredFooterButton={centeredFooterButton ?? false}
      {...otherProps}
      {...commonProps}
    />
  ) : (
    <MDialogPro
      back={false}
      maskClosable
      height={height}
      contentPadding={contentPadding}
      centeredFooterButton={centeredFooterButton ?? true}
      {...otherProps}
      {...commonProps}
    />
  );
});

MuiDialog.defaultProps = {
  height: '90%',
  // 是否支持键盘操作(esc关闭 + enter确定)。有弹窗套弹窗场景的，要看里外弹窗是否都开启了，注意事件会同时触发
  keyboard: false,
  contentPadding: '16px 16px',
};

export default MuiDialog;
