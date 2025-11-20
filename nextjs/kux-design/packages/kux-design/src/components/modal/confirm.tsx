/**
 * 调度命令式弹窗
 */
import ReactDom from 'react-dom';
import { type ReactNode } from 'react';
import { getConfig } from '@/setup';
import { ModalInner, type IModalProps } from './modal';
import { getMaskRoot } from '@/common';

export type IModalConfirmProps = Omit<IModalProps, 'children' | 'isOpen' | 'onClose' | 'onOk'> & {
  content: ReactNode;
};

/**
 * 创建确认弹窗
 * @param config 配置
 * @returns Promise<boolean> 确认返回 true, 取消返回 false
 */
export function createConfirm(config: IModalConfirmProps): Promise<boolean> {
  return new Promise((resolve) => {
    const maskRoot = getMaskRoot();
    const container = document.createElement('div');
    maskRoot.appendChild(container);

    const mergedConfig: IModalProps = {
      okText: getConfig('getOkText', true),
      cancelText: getConfig('getCancelText', true),
      ...config,
      isOpen: true,
      content: null,
      children: config.content,
      onClose: () => {
        resolve(false);
        destroyDlg();
      },
      onCancel: () => {
        resolve(false);
        destroyDlg();
      },
      onOk: () => {
        resolve(true);
        destroyDlg();
      },
      onShow: () => {
        config?.onShow?.();
      },
      onHide() {
        config?.onHide?.();
      },
    };

    const destroyDlg = () => {
      ReactDom.render(<ModalInner {...mergedConfig} isOpen={false} />, container);
      setTimeout(() => {
        ReactDom.unmountComponentAtNode(container);
        container.remove();
      }, 500); // 确保弹窗渲染完成后再销毁
    };

    ReactDom.render(<ModalInner {...mergedConfig} />, container);
  });
}
