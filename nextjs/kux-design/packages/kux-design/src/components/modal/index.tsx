import { createPortal } from 'react-dom';
import { getMaskRoot } from '@/common';

import { ModalInner, type IModalProps } from './modal';
import { createConfirm, type IModalConfirmProps } from './confirm';

export type { IModalProps } from './modal';
export type { IModalConfirmProps } from './confirm';

export function Modal(props: IModalProps) {
  // SSR 环境下不渲染 Modal
  if (app.isSSR) {
    return null;
  }
  return createPortal(
    <ModalInner {...props} />,
    getMaskRoot(),
  );
}

/**
 * 函数式方式弹出确认弹窗, 参数和 Modal 的整体一致
 * *不需要传 isOpen, onClose, onOk, onCancel
 * * okText 和 cancelText 也可不传, 使用 setup 中的 getOkText 和 getCancelText 方法获取默认值
 * * 使用 config.content 替代 参数 children
 * @returns Promise<boolean> 确认返回 true, 取消返回 false
 */
Modal.confirm = createConfirm;

export type IInfoModalProps = IModalConfirmProps;

/**
 * 函数式方式弹出信息弹窗, 参数与 Modal.confirm 一致, 但是没有取消按钮
 * @returns Promise<void>
 */
Modal.info = (config: IInfoModalProps) => {
  // info 模态框不需要取消按钮
  return createConfirm({ ...config, cancelText: null })
  // info 不需要返回值
  .then((_res) => void 0);
};

