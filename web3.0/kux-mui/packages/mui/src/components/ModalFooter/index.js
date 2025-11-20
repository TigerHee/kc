/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'hooks/index';
import { isFunction } from 'lodash-es';
import clsx from 'clsx';
import { ModalFooterRoot, BtnWrapper } from './kux';
import Button from '../Button';
import useClassNames from './useClassNames';

const ModalFooter = React.forwardRef(
  (
    {
      className,
      centeredButton,
      cancelText,
      okText,
      onCancel,
      onOk,
      okLoading,
      cancelButtonProps,
      okButtonProps,
      border,
      ...props
    },
    ref,
  ) => {
    const theme = useTheme();

    const _classNames = useClassNames({ centeredButton, border });

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

    return (
      <ModalFooterRoot
        {...props}
        border={border}
        className={clsx(_classNames.root, className)}
        theme={theme}
        ref={ref}
      >
        <BtnWrapper className={_classNames.btnWrapper} centeredButton={centeredButton}>
          {cancelText && (
            <Button
              disabled={okLoading}
              type="default"
              variant="outlined"
              onClick={onClickCancel}
              size="large"
              {...cancelButtonProps}
            >
              {cancelText}
            </Button>
          )}
          {okText && (
            <Button
              disabled={okLoading}
              loading={okLoading}
              onClick={onClickOk}
              size="large"
              {...okButtonProps}
            >
              {okText}
            </Button>
          )}
        </BtnWrapper>
      </ModalFooterRoot>
    );
  },
);

ModalFooter.propTypes = {
  border: PropTypes.bool, // 顶部边线
  okText: PropTypes.string, // 确认按钮文字
  cancelText: PropTypes.string, // 取消按钮文字
  okLoading: PropTypes.bool, // 确认按钮Loading状态
  onCancel: PropTypes.func, // 点击取消回调
  onOk: PropTypes.func, // 点击确认回调
  okButtonProps: PropTypes.object, // 确认按钮属性
  cancelButtonProps: PropTypes.object, // 取消按钮属性
  centeredButton: PropTypes.bool, // 居中按钮
};

ModalFooter.defaultProps = {
  border: true,
  okText: 'Ok',
  cancelText: 'Cancel',
  okLoading: false,
  onCancel: () => {},
  onOk: () => {},
  okButtonProps: {},
  cancelButtonProps: {},
  centeredButton: false,
};

ModalFooter.displayName = 'ModalFooter';

export default ModalFooter;
