/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useImperativeHandle, useRef, useLayoutEffect } from 'react';
import Dialog from '@mui/Dialog';
import useStateRef from '@/hooks/common/useStateRef';
import ReactDOM from 'react-dom';
import ThemeProvider from '@kux/mui/ThemeProvider';
import { EmotionCacheProvider } from '@kux/mui';
import storage from 'utils/storage';
import kcStorage from '@kucoin-base/kcStorage';
import { isRTLLanguage } from 'utils/langTools';
import { getLang } from 'Bot/helper';
import useMergeState from 'Bot/hooks/useMergeState.js';

// 动态创建子实例
const DialogRef = React.forwardRef(
  (
    {
      children,
      onVisibleChange,
      onShow,
      onClose,
      okButtonProps: okButtonPropsFromOut,
      cancelButtonProps: cancelButtonPropsFromOut,
      className,
      ...rest
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const [destroy, setDestroy] = useState(true);
    const [okLoading, setOkLoading] = useState(false);
    // 外部可以修改按钮的props
    const [{ okButtonProps, cancelButtonProps, ...otherBtnProps }, setBtnProps] = useMergeState({
      okButtonProps: {},
      cancelButtonProps: {},
      // 其他弹窗props也可以动态修改
    });
    // setTimeout中可以拿到最新
    const visibleRef = useStateRef(visible);
    // 记录来自toggle外界的参数 传递给children
    const fromOutForChildrenPropsRef = useRef();
    useImperativeHandle(
      ref,
      () => {
        return {
          toggle: (fromOutForChildrenProps) => {
            const nowVisible = !visibleRef.current;
            if (nowVisible) {
              // 只有打开才传递props
              fromOutForChildrenPropsRef.current = fromOutForChildrenProps;
              setDestroy(false);
            } else {
              setTimeout(() => {
                if (!visibleRef.current) {
                  setDestroy(true);
                  fromOutForChildrenPropsRef.current = null;
                }
              }, 350);
            }
            setVisible(nowVisible);
            return nowVisible;
          },
          show: () => {
            setDestroy(false);
            setVisible(true);
          },
          close: () => {
            setTimeout(() => {
              if (!visibleRef.current) {
                setDestroy(true);
                fromOutForChildrenPropsRef.current = null;
              }
            }, 350);
            setVisible(false);
          },
          updateOkLoading: (props) => {
            setOkLoading(props);
          },
          updateBtnProps: (props = {}) => {
            setBtnProps(props);
          },
        };
      },
      [],
    );
    useLayoutEffect(() => {
      onVisibleChange && onVisibleChange(visible);
      if (visible) {
        if (onShow) {
          onShow();
        }
      } else {
        // 动画完毕之后回调
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 400);
      }
    }, [visible]);
    // 只有打开才传递props
    let child = children;
    if (child) {
      const newProps = { ...children.props, visible };
      if (fromOutForChildrenPropsRef.current) {
        child = React.cloneElement(children, {
          ...newProps,

          ...fromOutForChildrenPropsRef.current,
        });
      }
    }
    const mergeBtnProps = {
      okButtonProps: {
        ...okButtonPropsFromOut,
        ...okButtonProps,
      },
      cancelButtonProps: {
        ...cancelButtonPropsFromOut,
        ...cancelButtonProps,
      },
      ...otherBtnProps,
    };

    return destroy ? null : (
      <Dialog
        open={visible}
        keepMounted
        show={visible}
        {...rest}
        okLoading={okLoading}
        className={`bot-dialog ${className}`}
        {...mergeBtnProps}
      >
        {child}
      </Dialog>
    );
  },
);

const info = (options) => {
  const container = document.createElement('div');
  document.body.append(container);

  const destroy = () => {
    const unmountResult = ReactDOM.unmountComponentAtNode(container);
    if (unmountResult && container) {
      container.remove();
    }
  };
  const onClose = () => {
    render({ ...iOptions, open: false });
    setTimeout(destroy, 350);
  };
  const iOptions = {
    ...options,
    onOk: () => {
      onClose();
      if (options.onOk) {
        options.onOk();
      }
    },
    onCancel: () => {
      onClose();
      if (options.onCancel) {
        options.onCancel();
      }
    },
  };
  const render = (optionss) => {
    const currentTheme = kcStorage?.getItem('theme') || storage.getItem('theme.current') || 'dark';
    const Info = (
      <EmotionCacheProvider isRTL={isRTLLanguage(getLang())}>
        <ThemeProvider theme={currentTheme}>
          <Dialog {...optionss} className={`bot-dialog ${optionss.className}`} open={optionss.open}>
            <div>{optionss.content}</div>
          </Dialog>
        </ThemeProvider>
      </EmotionCacheProvider>
    );

    ReactDOM.render(Info, container);
  };

  render({ ...iOptions, open: true });
};

DialogRef.info = info;

export const useBindDialogConfirm = (ref, onConfirm) => {
  if (onConfirm) {
    ref.current.confirm = onConfirm;
  }
  React.useLayoutEffect(() => {
    return () => {
      delete ref.current?.confirm;
    };
  }, []);
};
/**
 * @description: dialogRef与子组件按钮通信
 * @param {*} ref
 * @param {object|function} confirmOrBoth
 * @return {*}
 */
export const useBindDialogButton = (ref, confirmOrBoth) => {
  let onConfirm;
  let onCancel;
  if (typeof confirmOrBoth === 'function') {
    onConfirm = confirmOrBoth;
  } else if (typeof confirmOrBoth === 'object') {
    onConfirm = confirmOrBoth.onConfirm;
    onCancel = confirmOrBoth.onCancel;
  }
  if (onConfirm) {
    ref.current.confirm = onConfirm;
  }
  if (onCancel) {
    ref.current.cancel = onCancel;
  }
  React.useLayoutEffect(() => {
    return () => {
      delete ref.current?.confirm;
      delete ref.current?.cancel;
    };
  }, []);
};
export default DialogRef;
