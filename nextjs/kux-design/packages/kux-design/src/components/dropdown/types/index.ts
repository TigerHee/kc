/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IDropdownProps {
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;

  /**
   * Popper 样式
   */
  popperStyle?: React.CSSProperties;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 锚点元素属性
   */
  anchorProps?: React.HTMLAttributes<HTMLDivElement>;

  /**
   * 下拉内容
   */
  overlay: React.ReactNode;

  /**
   * 触发器内容
   */
  children: React.ReactNode;

  /**
   * 触发方式
   */
  trigger?: 'click' | 'hover';

  /**
   * Popper 类名
   */
  popperClassName?: string;
} 