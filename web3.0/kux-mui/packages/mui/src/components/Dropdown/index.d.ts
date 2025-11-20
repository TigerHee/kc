/**
 * Owner: victor.ren@kupotech.com
 */
import React, { StyleHTMLAttributes } from 'react';

export interface IDropdownProps {
  style?: React.StyleHTMLAttributes;
  popperStyle?: React.ScriptHTMLAttributes;
  visible?: boolean;
  disablePortal?: boolean;
  className?: string;
  anchorProps?: object;
  onVisibleChange?: (status: boolean) => void;
  overlay: React.ReactNode;
  children: React.ReactNode;
  trigger?: 'click' | 'hover';
}

declare const Dropdown: React.ForwardRefRenderFunction<HTMLDivElement, IDropdownProps>;

export default Dropdown;
