/**
 * Owner: saiya.lee@kupotech.com
 * ref: https://magicui.design/docs/components/marquee
 * @description Marquee component
 */

import { Fragment, type ComponentPropsWithoutRef, useRef, useState, useEffect } from 'react';
import { clx, formatStyleUnit } from '@/common/style';

import './style.scss'

export interface IMarqueeProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Gap between each repeated content, if a number is provided, it will be treated as pixels
   * @default 0
   */
  gap?: number | string;
  /**
   * Whether to always scroll, even if the content is not overflowing
   */
  alwaysScroll?: boolean;
  /**
   * Duration of the animation, if a number is provided, it will be treated as seconds
   * @default 20s
   */
  duration?: string | number;
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode;
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean;
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number;
}

export function Marquee({
  className,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  gap,
  style,
  duration,
  alwaysScroll,
  ...props
}: IMarqueeProps) {
  const domRef = useRef<HTMLDivElement>(null);

  const [isScrollable, setIsScrollable] = useState(alwaysScroll || false)


  useEffect(() => {
    if (alwaysScroll) {
      domRef.current?.parentElement?.classList.add('is-scrollable');
      return;
    }
    const checkScrollable = () => {
      const dom = domRef.current;
      const parentEl = dom?.parentElement;
      if (!dom || !parentEl) return;
      const isItemScrollable = isOverflowing(parentEl, dom, vertical);
      setIsScrollable(isItemScrollable);
    };
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => {
      window.removeEventListener('resize', checkScrollable);
    }
  }, [children, vertical, alwaysScroll])

  // if no children, return null
  if (!children) return null;
  const styleVars: Record<string, any> = {};
  if (gap) styleVars['--gap'] = formatStyleUnit(gap);
  if (duration) styleVars['--duration'] = formatStyleUnit(duration, 's');
  if (style) Object.assign(styleVars, style);
  return (
    <div
      {...props}
      style={styleVars}
      className={clx(
        'kux-marquee',
        {
          'is-vertical': vertical,
          'is-scrollable': isScrollable,
          'is-pause-on-hover': pauseOnHover,
        },
        className,
      )}
    >
      <div className="kux-marquee-item" ref={domRef}>{children}</div>
      {Array(Math.max(isScrollable ? repeat - 1 : 0, 0))
        .fill(0)
        .map((_, i) => (
          <Fragment key={i}>
            <div className="kux-marquee-spacer" />
            <div
              className="kux-marquee-item"
            >
              {children}
            </div>
        </Fragment>
        ))}
    </div>
  );
}

function isOverflowing(container: HTMLElement, element: HTMLElement, vertical?: boolean) {
  const rect = container.getBoundingClientRect();
  if (vertical) {
    return element.scrollHeight + Math.abs(element.offsetTop) > rect.height;
  }
  return element.scrollWidth + Math.abs(element.offsetLeft) > rect.width;
}