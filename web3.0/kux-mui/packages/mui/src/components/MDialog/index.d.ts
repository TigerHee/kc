/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import ModalHeader from '../ModalHeader';
import ModalFooter from '../ModalFooter';

export interface IMDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Drawer内容
   */
  children?: React.ReactNode;

  /**
   * 是否显示
   */
  show: boolean;

  /**
   * 标题
   */
  title: ReactNode;

  /**
   * 关闭时触发的回调函数
   */
  onClose?: React.MouseEventHandler<HTMLDivElement>;

  /**
   * 显示返回箭头
   */
  back?: boolean;

  /**
   * 点击确认
   */
  onOk?: React.MouseEventHandler<HTMLDivElement>;

  /**
   * 点击取消
   */
  onCancel?: React.MouseEventHandler<HTMLDivElement>;

  /**
   * 点击返回
   */
  onBack?: React.MouseEventHandler<HTMLDivElement>;

  /**
   * 确定按钮文案
   */
  okText?: string;

  /**
   * 取消按钮文案
   */
  cancelText?: string;

  /**
   * 确认按钮属性
   */
  okButtonProps: object;

  /**
   * 取消按钮属性
   */
  cancelButtonProps: object;

  /**
   * 居中按钮
   */
  centeredFooterButton: boolean;

  /**
   * header 属性，参考 ModalHeader 组件
   */
  headerProps?: ModalHeader;

  /**
   * footer 属性，参考 ModalFooter 组件
   */
  footerProps?: ModalFooter;

  /**
   * 隐藏footer或者自定义footer
   */
  footer: ReactNode;
}

declare const MDialog: React.ForwardRefRenderFunction<HTMLDivElement, IMDialogProps>;

export default MDialog;
