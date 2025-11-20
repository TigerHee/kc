/**
 * Owner: saiya.lee@kupotech.com
 *
 * @description Space component
 */
import { formatStyleUnit, clx } from '@/common/style'
import { type IDirection } from '@/shared-type';
import { useStackContext } from '../stack/stack-provider'
import './style.scss'

export interface ISpaceProps {
  /**
   * 自定义类名
   */
  className?: string
  /**
   * 空白方向, 默认为水平
   */
  direction?: IDirection
  /**
   * 空白间距, 如果是数字则会被当作px处理
   * 设置后会失去弹性伸缩特性，保持固定长度
   */
  length?: number | string
  /**
   * 最小间距, 如果是数字则会被当作px处理
   */
  minLength?: number | string
}

/**
 * Spacer component
 * 类似 SwiftUI 的 Spacer，用于在 Stack 布局中创建弹性间距
 * - 默认情况下会弹性伸缩并平均分配剩余空间
 * - 设置 minLength 后会保持最小间距
 * - 设置 length 后会保持固定间距，失去弹性伸缩特性
 */
export function Spacer({ direction, length, minLength, className, ...props }: ISpaceProps) {
  const ctx = useStackContext();
  const style: React.CSSProperties = {};
  const dir = direction || ctx.direction;
  const len = length || ctx.spacing;

  // 优先应用 minLength
  if (!app.is(minLength, 'nullable')) {
    // @ts-expect-error css variables
    style['--kux-space-min'] = formatStyleUnit(minLength);
  } else if (!app.is(len, 'nullable')) {
    const formattedLen = formatStyleUnit(len);
    // @ts-expect-error css variables
    style['--kux-space'] = formattedLen;
    // 设置了固定长度时，禁用弹性伸缩
    // @ts-expect-error css variables
    style['--kux-space-flex'] = '0 0 auto';
  }

  return (
    <div
      className={clx('kux-spacer', className, dir && `is-${dir}`)}
      style={style}
      {...props}
    />
  );
}
