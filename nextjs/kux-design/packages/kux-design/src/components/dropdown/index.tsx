/**
 * Owner: victor.ren@kupotech.com
 *
 * @description Dropdown component
 */

import React from 'react';
import { clx } from '@/common/style';
import { IDropdownProps } from './types';
import { Popover } from '../popover';

import './style.scss';

export const Dropdown = React.forwardRef<HTMLDivElement, IDropdownProps>(
  ({
    style,
    overlay,
    trigger = 'click',
    children,
    className,
    popperStyle,
    popperClassName,
    anchorProps: anchorPropsFromProps = {},
  }, ref) => {
    const dropdownClassName = clx(
      'kux-dropdown',
      className
    );

    const overlayClassName = clx(
      'kux-dropdown__overlay',
      popperClassName
    );

    return (
      <div
        ref={ref}
        className={dropdownClassName}
        style={style}
      >
        <Popover
          placement="bottom"
          trigger={trigger}
          showArrow={false}
          content={
            <div className={overlayClassName} style={popperStyle}>
              {overlay}
            </div>
          }
          style={anchorPropsFromProps.style}
        >
          <div {...anchorPropsFromProps}>
            {children}
          </div>
        </Popover>
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';
