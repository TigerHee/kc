/*
 * owner: Borden@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { Dialog, MDialog, styled, useResponsive } from '@kux/mui';
import { useMemoizedFn } from 'ahooks';
import NoSSG from 'components/NoSSG';
import { isFunction } from 'lodash';
import { forwardRef, useEffect } from 'react';
import checkIsMobile from 'src/utils/isMobile';

const MDialogPro = styled(MDialog)`
  height: ${(props) => props.height};
  .KuxDrawer-content {
    display: flex;
    flex-direction: column;
  }
  .KuxMDialog-content {
    height: 100%;
    padding: 0 16px 34px 16px !important;
    padding: ${(props) => props.contentPadding || 0};
    color: ${(props) => props.theme.colors.text60};
  }
  .KuxModalFooter-buttonWrapper .KuxButton-loading {
    & > svg {
      margin-right: 0;
    }
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
    okText,
    onClose,
    onCancel,
    keyboard,
    okButtonProps,
    contentPadding,
    centeredFooterButton,
    ...otherProps
  } = props;
  const _show = open || show;
  const _onClose = onCancel || onClose;

  const isInApp = JsBridge.isApp();
  const { sm } = useResponsive();
  const isMobile = checkIsMobile();

  const commonProps = {
    ref,
    onOk,
    open: _show,
    show: _show,
    onClose: _onClose,
    onCancel: _onClose,
  };

  const handleKeyDown = useMemoizedFn((e) => {
    if (e?.keyCode === 13) {
      if (isFunction(onOk)) onOk();
    } else if (e?.keyCode === 27) {
      if (isFunction(_onClose)) _onClose();
    }
  });

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

  return (
    <NoSSG>
      {sm && !isInApp ? (
        <StyledDialog
          okText={okText}
          okButtonProps={okButtonProps}
          centeredFooterButton={centeredFooterButton ?? false}
          {...otherProps}
          {...commonProps}
        />
      ) : (
        <MDialogPro
          back={false}
          maskClosable
          height={height}
          okButtonProps={okButtonProps}
          contentPadding={contentPadding}
          headerProps={{ border: false }}
          okText={okButtonProps?.loading ? ' ' : okText}
          centeredFooterButton={centeredFooterButton ?? true}
          {...otherProps}
          {...commonProps}
        />
      )}
    </NoSSG>
  );
});

MuiDialog.defaultProps = {
  height: 'auto',
  // 是否支持键盘操作(esc关闭 + enter确定)。有弹窗套弹窗场景的，要看里外弹窗是否都开启了，注意事件会同时触发
  keyboard: false,
  contentPadding: '16px 16px',
};

export default MuiDialog;
