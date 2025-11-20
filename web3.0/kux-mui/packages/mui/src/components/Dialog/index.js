/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import useId from 'hooks/useId';
import Portal from '../Portal';
import DialogBase from './Dialog';
import getInstance from './dialogInstance';

const instance = getInstance();

const Dialog = React.forwardRef((props, ref) => {
  const { disablePortal, destroyOnClose, forceRender, container, open, ...others } = props;
  const dialogId = useId();

  const composeRef = React.useRef();
  let portal = null;

  React.useEffect(() => {
    if (open) {
      instance.add(dialogId);
    } else {
      instance.remove(dialogId);
    }
    return () => {
      instance.remove(dialogId);
    };
  }, [dialogId, open]);

  if (!forceRender && destroyOnClose && !open) {
    return null;
  }
  if (open || composeRef.current || forceRender) {
    portal = (
      <Portal disablePortal={disablePortal} ref={composeRef} container={container}>
        <DialogBase ref={ref} open={open} {...others} />
      </Portal>
    );
  }
  return portal;
});

Dialog.propTypes = {
  open: PropTypes.bool, // 显示/隐藏Dialog
  size: PropTypes.oneOf(['basic', 'medium', 'large', 'fullWidth']), // 弹窗大小
  children: PropTypes.node.isRequired, // 内容
  okText: PropTypes.string, // 确定的文字
  cancelText: PropTypes.string, // 取消的文字
  onOk: PropTypes.func, // 确定的回调
  onCancel: PropTypes.func, // 取消的回调
  okLoading: PropTypes.bool, // 确定按钮 loading
  showCloseX: PropTypes.bool, // 显示/隐藏X
  footer: PropTypes.node, // footer 内容
  header: PropTypes.node, // header 内容
  title: PropTypes.node, // 标题文字
  closeNode: PropTypes.node, // 自定义右上角的x
  maskClosable: PropTypes.bool, // 点击蒙层是否允许关闭
  rootProps: PropTypes.object, // dialog 容器层属性
  maskProps: PropTypes.object, // 遮罩属性
  okButtonProps: PropTypes.object,
  cancelButtonProps: PropTypes.object,
  forceRender: PropTypes.bool, // 预渲染内容
  centeredFooterButton: PropTypes.bool, // Footer按钮居中，如果是两个按钮，则对半，如果是一个按钮则撑满
  headerProps: PropTypes.object,
  footerProps: PropTypes.object,
};

Dialog.defaultProps = {
  open: false,
  size: 'basic',
  showCloseX: true,
  okText: 'Ok',
  cancelText: 'Cancel',
  okLoading: false,
  title: '',
  maskClosable: false,
  onCancel: () => {},
  onOk: () => {},
  rootProps: {},
  maskProps: {},
  okButtonProps: {},
  cancelButtonProps: {},
  forceRender: false,
  centeredFooterButton: false,
  headerProps: {},
  footerProps: {},
  footer: undefined,
  header: undefined,
};

Dialog.displayName = 'Dialog';

export default Dialog;
