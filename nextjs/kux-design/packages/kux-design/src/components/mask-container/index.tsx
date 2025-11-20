/**
 * Owner: saiya.lee@kupotech.com
 *
 * @description MaskContainer component
 */
import { createPortal } from 'react-dom';
import { forwardRef, type ComponentProps, type CSSProperties } from 'react';
import { useZIndex, useLockScroll } from '@/hooks';
import { clx, getMaskRoot } from '@/common';
import './style.scss'

export interface IMaskContainerProps extends ComponentProps<'div'> {
  /**
   * 蒙层是否打开, 仅用于控制是否锁定滚动以及z-index的分配，不影响蒙层显隐
   * true 时锁定滚动并设置 z-index
   */
  isOpen?: boolean
  children?: React.ReactNode
}

/**
 * MaskContainer component
 */
export const MaskContainer = forwardRef<HTMLDivElement, IMaskContainerProps>(function MaskContainer({children, isOpen, className, style, ...rest}, ref) {
  const zIndex = useZIndex(isOpen);
  useLockScroll(!!isOpen);
  // SSR 环境下不渲染蒙层
  if (app.isSSR) {
    return null;
  }

  const maskStyle: CSSProperties = {
    zIndex,
    ...style,
  };
  return createPortal(
    <div className={clx('kux-mask-container', className)} style={maskStyle} {...rest} ref={ref}>
      {children}
    </div>
  , getMaskRoot());
});
