/**
 * Owner: saiya.lee@kupotech.com
 *
 * @description Icon component
 */
import { type ComponentType, type ComponentProps } from 'react';

const SIZE_MAP = {
  tiny: 12,
  small: 16,
  medium: 24,
  large: 32,
} as const;

type ISizeName = keyof typeof SIZE_MAP;

export interface IIconProps extends ComponentProps<'svg'> {
  /**
   * 尺寸 tiny(12)/small(16)/medium(24)/large(32)
   * @default 24
   */
  size?: number | ISizeName;
  /**
   * 图标是否 180 度旋转(方向反转)
   */
  inverted?: boolean;
  /**
   * 是否在rtl模式下对称反转，默认不反转
   * @default false
   */
  rtl?: boolean;
  className?: string;
}

export interface IKuxIconProps extends IIconProps {
  icon: ComponentType<ComponentProps<'svg'>>; // 图标组件
}

/**
 * Icon component
 */
export function KuxIcon({ size, style, inverted, rtl, icon, className, ...props }: IKuxIconProps) {
  const IconComponent = icon;
  // 图标不存在即返回null
  if (!IconComponent) return null;
  // @ts-expect-error 优先使用size map 取值
  const iconSize = SIZE_MAP[size] || size || 24;
  const newStyle = Object.assign({}, style, {
    '--kc-icon-size': typeof iconSize === 'number' ? `${iconSize}px` : iconSize,
  });
  const mergedClassName = ['kux-icon', rtl && 'kux-flip-rtl', inverted && 'kux-inverted', className].filter(Boolean).join(' ');
  return (
    <IconComponent
      {...props}
      style={newStyle}
      className={mergedClassName} />
  );
}
