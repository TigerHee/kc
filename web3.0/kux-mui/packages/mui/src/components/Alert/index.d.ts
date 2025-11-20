/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IAlertProps {
  /**
   * 指定警告提示的样式，有四种选择 success、info、warning、error
   */
  type: 'success' | 'warning' | 'error' | 'info';

  /**
   * 警告提示内容
   */
  title?: React.ReactNode;

  /**
   * 警告提示的辅助性文字介绍
   */
  description?: React.ReactNode;

  /**
   * 是否显示辅助图标
   */
  showIcon?: boolean;

  /**
   * 自定义图标，showIcon 为 true 时有效
   */
  icon?: React.ReactNode;

  /**
   * 默认不显示关闭按钮
   */
  closable?: boolean;

  /**
   * 关闭时触发的回调函数
   */
  onClose?: () => void;

  /**
   * 自定义操作项
   */
  action?: React.ReactNode;
}

declare const Alert: React.FC<IAlertProps>;

export default Alert;
