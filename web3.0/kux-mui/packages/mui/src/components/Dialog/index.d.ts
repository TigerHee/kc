/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import ModalFooter from '../ModalFooter';
import ModalHeader from '../ModalHeader';
import { IButtonProps } from '../Button';

export interface IDialogProps {
  /**
   * 显示/隐藏Dialog，默认值为 false
   */
  open?: boolean;

  /**
   * 大小，默认为 'basic'
   */
  size?: 'basic' | 'large' | 'medium' | 'mini' | 'fullWidth';

  /**
   * 确定按钮的文字，默认值为 '确定'
   */
  okText?: string;

  /**
   * 取消按钮的文字，默认值为 '取消'
   */
  cancelText?: string;

  /**
   * 点击确定时的回调
   */
  onOk?: React.MouseEventHandler<HTMLButtonElement>;

  /**
   * 点击取消时的回调
   */
  onCancel?: React.MouseEventHandler<HTMLButtonElement>;

  /**
   * 容器的样式类名
   */
  wrapClassName?: string;

  /**
   * 是否展示X关闭按钮，默认为true
   */
  showCloseX?: boolean;

  /**
   * 显示/隐藏banner，默认false
   */
  showBanner?: boolean;

  // bannerSrc
  bannerSrc?: string;

  // footer 内容
  footer?: React.ReactNode;

  /**
   * 标题文字，默认值为 '标题'
   */
  title?: React.ReactNode;

  /**
   * 自定义X关闭按钮，默认undefined
   */
  closeNode?: React.ReactNode; // 自定义右上角的x

  /**
   * 点击蒙层是否允许关闭，默认false
   */
  maskClosable?: boolean;

  /**
   * 弹窗内容
   */
  children: React.ReactNode;

  /**
   * 关闭时销毁 Dialog 里的子元素
   */
  destroyOnClose?: boolean;

  /**
   * 指定 Dialog 挂载的节点
   */
  container?: () => HTMLElement | HTMLElement;

  /**
   * ok Button 的props
   */
  okButtonProps?: IButtonProps;

  /**
   * cancel Button 的props
   */
  cancelButtonProps?: IButtonProps;

  /**
   * 确定按钮 loading
   */
  okLoading?: boolean;

  /**
   * header dialog的header
   */
  header?: React.ReactNode;

  /**
   * 是否预渲染
   */
  forceRender?: boolean;

  /**
   * Footer按钮居中，如果是两个按钮，则对半，如果是一个按钮则撑满
   */
  centeredFooterButton?: boolean;

  /**
   * 额外的 header 属性，参考 ModalHeader
   */
  headerProps?: ModalHeader;

  /**
   * 额外的 footer 属性，参考 ModalFooter
   */
  footerProps?: ModalFooter;
   
}

declare const Dialog: React.ForwardRefRenderFunction<HTMLDivElement, IDialogProps>;

export default Dialog;
