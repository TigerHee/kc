/**
 * Owner: saiya.lee@kupotech.com
 *
 * @description Divider component
 */

import './style.scss'
import { isRenderable, clx, formatStyleUnit } from '@/common';
import { useMemo, type CSSProperties, type ReactNode} from 'react';
import { type IDirection } from '@/shared-type';

export interface IDividerProps {
  /** 分割线方向 */
  direction?: IDirection;
  /** 文字位置 */
  orientation?: 'start' | 'center' | 'end';
  /** 文字与边的距离 */
  orientationMargin?: string | number;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 自定义类名 */
  className?: string;
  /** 分割线内容 */
  children?: ReactNode;
}

/**
 * Divider component
 */

export function Divider({
  direction = 'horizontal',
  orientation = 'center',
  orientationMargin,
  style,
  className,
  children,
}: IDividerProps) {
  const isVertical = direction === 'vertical';
  const hasChildren = children !== '' && isRenderable(children);

  const mergedClassName = clx(
    'kux-divider',
    `is-${direction}`,
    `is-${orientation}`,
    className,
  );

  const hasMargin = hasChildren && !isVertical && orientation !== 'center' && !app.is(orientationMargin, 'nullable');

  const mergedStyle = useMemo(() => {
    if (!hasMargin) return style;
    const margin = formatStyleUnit(orientationMargin);
    return {
      ...style,
      '--kux-divider-orientation-margin': margin,
    };
  }, [style, hasMargin, orientationMargin]);

  return (
    <div className={mergedClassName} style={mergedStyle} role="separator">
      {hasChildren && !isVertical ? (
        <>
          <div className="kux-divider-line-start"/>
          <div className="kux-divider-text">{children}</div>
          <div className="kux-divider-line-end"/>
        </>
      ) : null}
      {!hasChildren && !isVertical && <div className="kux-divider-line-full" />}
    </div>
  );
}
