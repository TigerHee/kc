/**
 * Owner: victor.ren@kupotech.com
 */
 import React from 'react';

 export interface IModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 顶部边线
   */
  border?: boolean;

  /**
   * 确认按钮文字
   */
  okText?: string;

  /**
   * 取消按钮文字
   */
  cancelText?: string;

  /**
   * 确认按钮Loading状态
   */
  okLoading?: boolean;

  /**
   * 点击取消回调
   */
  onCancel?: React.MouseEventHandler<HTMLDivElement>;

  /**
   * 点击确认回调
   */
  onOk?: React.MouseEventHandler<HTMLDivElement>;

  /**
   * 确认按钮属性
   */
  okButtonProps?: React.ReactNode;

  /**
   * 取消按钮属性
   */
  cancelButtonProps?: React.ReactNode;

  /**
   * 居中按钮
   */
  centeredButton?: boolean;

 }
 
 declare const ModalFooter: React.ForwardRefRenderFunction<HTMLDivElement, IModalFooterProps>;
 
 export default ModalFooter;
 