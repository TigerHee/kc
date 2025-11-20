/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { isFunction, isNull } from 'lodash-es';
import useTheme from 'hooks/useTheme';
import useDynamicID from 'hooks/useDynamicID';
import ModalHeader from '../ModalHeader';
import ModalFooter from '../ModalFooter';
import useClassNames from './useClassNames';
import { DialogRoot, DialogMask, DialogBody, DialogContent } from './kux';

/**
 * @param {import(".").IDialogProps} props
 * @returns
 */
const Dialog = React.forwardRef((props, ref) => {
  const {
    children,
    open,
    okText,
    cancelText,
    onOk,
    onCancel,
    showCloseX,
    size,
    title,
    footer,
    maskClosable,
    header,
    okLoading,
    maskProps,
    rootProps,
    okButtonProps,
    cancelButtonProps,
    className,
    centeredFooterButton,
    headerProps,
    footerProps,
    ...restProps
  } = props;
  const maskRef = React.useRef();
  const theme = useTheme();
  const titleId = useDynamicID();
  const desId = useDynamicID();

  const handleMaskClick = (e) => {
    if (maskRef.current === e.target) {
      onClickCancel();
    }
  };
  // 点击取消
  const onClickCancel = useCallback(
    (e) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (okLoading) {
        // 处于okLoading状态不允许关闭弹窗
        return;
      }
      if (onCancel && isFunction(onCancel)) {
        onCancel();
      }
    },
    [onCancel, okLoading],
  );
  // 点击确认
  const onClickOk = useCallback(
    (e) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (onOk && isFunction(onOk)) {
        onOk();
      }
    },
    [onOk],
  );

  const _classNames = useClassNames(props);

  const labelledbyProp = useMemo(() => {
    const _prop = {};
    if (!isNull(header)) {
      _prop['aria-labelledby'] = titleId;
    }
    return _prop;
  }, [header, titleId]);

  const renderHeader = useCallback(() => {
    if (isNull(header)) {
      return null;
    }
    if (header) {
      // 传入的header外层多了一个div
      return <div id={titleId}>{header}</div>;
    }
    return (
      <ModalHeader
        title={title}
        onClose={onClickCancel}
        border={false}
        disableClose={okLoading}
        close={showCloseX}
        id={titleId}
        {...headerProps}
      />
    );
  }, [header, titleId, title, okLoading, onClickCancel, headerProps, showCloseX]);

  return (
    <DialogRoot
      className={clsx(_classNames.root, className)}
      ref={ref}
      show={open}
      theme={theme}
      size={size}
      role="dialog"
      aria-modal="true"
      aria-describedby={desId}
      {...labelledbyProp}
      {...rootProps}
    >
      <DialogMask
        ref={maskRef}
        onClick={(e) => {
          return maskClosable ? handleMaskClick(e) : '';
        }}
        show={open}
        theme={theme}
        className={_classNames.mask}
        {...maskProps}
      />
      <DialogBody className={_classNames.body} {...restProps} theme={theme} size={size} show={open}>
        {renderHeader()}
        <DialogContent className={_classNames.content} size={size} theme={theme} id={desId}>
          {children}
        </DialogContent>
        {isNull(footer)
          ? null
          : footer || (
              <ModalFooter
                border={false}
                cancelText={cancelText}
                okText={okText}
                okButtonProps={{ size: 'basic', ...okButtonProps }}
                cancelButtonProps={{ size: 'basic', ...cancelButtonProps }}
                centeredButton={centeredFooterButton}
                okLoading={okLoading}
                onOk={onClickOk}
                onCancel={onClickCancel}
                {...footerProps}
              />
            )}
      </DialogBody>
    </DialogRoot>
  );
});

export default Dialog;
