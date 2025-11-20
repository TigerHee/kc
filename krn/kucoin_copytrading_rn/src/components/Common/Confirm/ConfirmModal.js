import React, {isValidElement, memo} from 'react';
import {css} from '@emotion/native';
import {Confirm} from '@krn/ui';

import ConfirmFooter from './ConfirmFooter';
import {ConfirmModalWrap, ModalMessageText, ModalTitle} from './styles';

/**
 * ConfirmModal 基于@krn/ui Confirm的底部弹窗组件 具备title btnGroup等拓展属性
 * @param {Object} props 组件的属性。
 * @param {boolean} props.show 是否显示弹出窗口。
 * @param {function} props.onClose 处理弹出窗口关闭事件的回调函数。
 * @param {string} props.id 弹出窗口元素的 id。
 * @param {Object} [props.contentStyle={}] 应用于内容重写覆盖的样式对象，可选。
 * @param {string} props.title 弹出窗口的标题。
 * @param {React.ReactNode} props.footer 底部内容，当不需要默认底部按钮时，可以设为 footer: null
 * @param {string} props.cancelText 取消按钮的文本。
 * @param {string} props.okText 确定按钮的文本。
 * @param {function} props.onCancel 处理取消事件的回调函数。
 * @param {function} props.onOk 处理确定事件的回调函数。
 * @param {boolean} [props.hiddenCancel=false] 是否隐藏取消按钮，可选。
 * @param {boolean} [props.hiddenOk=false] 是否隐藏确定按钮，可选。
 * @param {React.ReactNode} props.children 在内容包装器内渲染的子元素。
 */
const ConfirmModal = props => {
  const {
    title = '',
    show,
    footer,
    cancelText,
    okText,
    onCancel,
    onOk,
    onClose,
    message,
    hiddenCancel = false,
    hiddenOk = false,
  } = props;

  const confirmFooterProps = {
    footer,
    okText,
    cancelText,
    onCancel,
    onOk,
    hiddenCancel,
    hiddenOk,
  };

  return (
    <Confirm show={show} onClose={onClose}>
      <ConfirmModalWrap>
        {!!title && <ModalTitle>{title}</ModalTitle>}
        {!isValidElement(message) ? (
          <ModalMessageText>{message}</ModalMessageText>
        ) : (
          message
        )}

        <ConfirmFooter
          style={css`
            padding: 24px 0 0;
          `}
          {...confirmFooterProps}
        />
      </ConfirmModalWrap>
    </Confirm>
  );
};

export default memo(ConfirmModal);

ConfirmModal.displayName = 'ConfirmModal';
