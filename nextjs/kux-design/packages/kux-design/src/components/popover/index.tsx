/**
 * Owner: larvide.peng@kupotech.com
 *
 * @description Popover component
 */

import { type ReactNode, type CSSProperties, useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { clx, isRenderable, getMaskRoot } from '@/common';
import { useZIndex } from '@/hooks';
import { handleChangePlacementByDir } from './tools';
import { usePopoverPosition } from './usePopoverPosition';

import './style.scss';

export type IPopoverColors = string | { background: string; border: string };

export interface IPopoverProps {
  /**
   * 显示位置
   */
  placement:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'top-end'
    | 'top-start'
    | 'top'
    | 'left'
    | 'right'
    | 'left-start'
    | 'left-end'
    | 'right-start'
    | 'right-end';
  /**
   * trigger popover
   * * click: click to trigger
   * * hover: hover to trigger
   * * persist: always show
   */
  trigger?: 'click' | 'hover' | 'persist';
  /**
   * 箭头大小, 默认为 medium
   */
  arrowSize?: 'medium' | 'large';
  /**
   * 是否显示箭头
   */
  showArrow?: boolean;
  children: ReactNode;
  /**
   * popover内容
   */
  content: ReactNode;
  /**
   * popover 内容区域样式
   */
  style?: CSSProperties;
  /**
   * popover colors
   * * string: 背景色与边框色相同
   * * object: { background: string, border: string }
   */
  colors?: IPopoverColors;
  className?: string;
  /**
   * popover打开回调
   */
  onShow?: () => void;
  /**
   * popover关闭回调
   */
  onHide?: () => void;
}

export interface IPopoverContent {
  /**
   * 显示位置
   */
  placement: IPopoverProps['placement'];
  /**
   * 显示内容
   */
  content: ReactNode;
  /**
   * 是否显示
   */
  isOpen?: boolean;
  popoverRef?: React.RefObject<HTMLDivElement>;
  style?: CSSProperties;
  /**
   * 箭头大小
   */
  arrowSize?: 'medium' | 'large' | undefined;
  /**
   * 是否显示箭头
   */
  showArrow?: boolean;
  /**
   * 是否以正常文档流显示
   */
  isStatic?: boolean;
  className?: string;
}

export const PopoverContent = (props: IPopoverContent) => {
  const {
    isOpen,
    placement,
    content,
    style,
    arrowSize = 'medium',
    showArrow = true,
    isStatic,
    className,
  } = props;
  const { popoverPosition, visible, dir, popoverContentRef } = usePopoverPosition(props);
  const isContentRenderable = isRenderable(content); // content是否渲染

  const zIndex = useZIndex(isOpen);
  // SSR 环境下不渲染 Modal
  if (app.isSSR) {
    return null;
  }

  if (!isOpen || !isContentRenderable) {
    return null;
  }

  const cusStyles = !isStatic
    ? {
        ...style,
        ...popoverPosition,
        position: 'fixed',
        zIndex,
      }
    : {};

  const renderContent = (
    <div
      className={clx('kux-popover-content', `kux-popover-${visible ? 'show' : 'hide'}`, className, {
        'kux-popover-content-static': isStatic,
      })}
      style={cusStyles}
      ref={popoverContentRef}
      data-testid="kux-popover-content"
      data-placement={handleChangePlacementByDir(placement, dir)}
      data-static={isStatic}
    >
      {showArrow && (
        <div
          data-testid="kux-popover-arrow"
          className="kux-popover-arrow"
          data-size={arrowSize}
        ></div>
      )}
      {content}
    </div>
  );

  return isStatic ? renderContent : ReactDOM.createPortal(renderContent, getMaskRoot());
};

/**
 * Popover component
 */
export const Popover = ({
  placement = 'top',
  trigger = 'hover',
  showArrow = true,
  arrowSize,
  children,
  content,
  style,
  colors,
  className,
  onShow,
  onHide,
}: IPopoverProps) => {
  const [isOpen, setIsOpen] = useState(['persist', 'static'].includes(trigger));
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverColors = getPopoverColors(colors);

  const showPopover = () => {
    setIsOpen(true);
    onShow?.();
  };
  const hidePopover = useCallback(() => {
    setIsOpen(false);
    onHide?.();
  }, [onHide]);
  const handleClick = () => {
    if (trigger !== 'click') return;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isOpen ? hidePopover() : showPopover();
  };
  const handleMouseEnter = () => {
    if (trigger !== 'hover') return;
    showPopover();
  };
  const handleMouseLeave = () => {
    if (trigger !== 'hover') return;
    hidePopover();
  };

  useEffect(() => {
    if (trigger !== 'click') return;
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const popOverContent = popoverRef.current;
      if (!popOverContent) return;
      if (!popOverContent.contains(event.target as Node)) {
        hidePopover();
      }
    };
    document.addEventListener('click', handleClickOutside, {
      passive: true,
    });
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [trigger, isOpen, hidePopover]);

  return (
    <div
      className='kux-popover'
      style={popoverColors}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={popoverRef}
      onClick={handleClick}
    >
      {children}
      <PopoverContent
        isOpen={isOpen}
        placement={placement}
        popoverRef={popoverRef}
        content={content}
        style={{ ...style }}
        arrowSize={arrowSize}
        showArrow={showArrow}
        className={className}
      />
    </div>
  );
};

function getPopoverColors(colors?: IPopoverColors): Record<string, string> {
  if (!colors) return {};
  if (app.is(colors, 'string')) {
    return {
      '--kux-popover-bg-color': colors,
      '--kux-popover-border-color': colors,
    };
  }
  if (app.is(colors, 'object')) {
    return {
      '--kux-popover-bg-color': colors.background,
      '--kux-popover-border-color': colors.border,
    };
  }
  return {};
}
