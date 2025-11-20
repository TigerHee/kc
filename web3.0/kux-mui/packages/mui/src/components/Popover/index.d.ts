/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IPopoverProps {
  trigger: 'hover' | 'click';
  arrow?: boolean;
  children: React.ReactNode;
  enterDelay?: number;
  enterNextDelay?: number;
  id?: string;
  leaveDelay?: number;
  onClose?: (event: React.MouseEvent | React.TouchEvent) => void;
  onOpen?: (event: React.MouseEvent | React.TouchEvent) => void;
  open?: boolean;
  placement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
  title?: React.ReactNode;
  offset?: number;
}

declare const Popover: React.ForwardRefRenderFunction<HTMLDivElement, IPopoverProps>;

export default IPopoverProps;
