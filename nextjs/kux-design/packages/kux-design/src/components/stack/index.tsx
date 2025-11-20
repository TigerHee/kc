/**
 * Owner: saiya.lee@kupotech.com
 *
 * @description HStack component
 */
import { useMemo } from 'react';
import { clx } from '@/common';
import { useResponsive, compareViewportSize, type IViewportSize } from '@/hooks';
import { StackProvider } from './stack-provider';
import { type IDirection } from '@/shared-type';

import './style.scss';

export interface IStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 自定义对齐方式
   * @default 'center'
   */
  align?: React.CSSProperties['alignItems'];
  /**
   * 自定义对齐方式
   * @default 'center'
   */
  justify?: React.CSSProperties['justifyContent'];
  /**
   * flex 方向
   */
  direction: IDirection;
  /**
   * flex内 Spacer 大小, 仅影响 Spacer 组件, 非 gap 属性, 若不设置则 Spacer 使用 auto (flex 1)
   */
  spacing?: number | string;
  /**
   * 宽度是否填充整个区域
   */
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * Stack component
 */
export function Stack(props: IStackProps) {
  const { direction, spacing, className, style, align, justify, fullWidth, ...rest } = props;
  const classes = clx('kux-stack', className, `is-${direction}`, {
    'is-full-width': fullWidth
  });

  const combinedStyle = useMemo(() => {
    if (!justify && !align) {
      return style;
    }
    const newStyle = { ...style };
    if (justify) {
      newStyle.justifyContent = justify;
    }
    if (align) {
      newStyle.alignItems = align;
    }
    return newStyle;
  }, [align, justify, style]);

  return (
    <StackProvider direction={direction} spacing={spacing}>
      <div className={classes} style={combinedStyle} {...rest}>
        {props.children}
      </div>
    </StackProvider>
  );
}

/**
 * 横向的stack
 */
export const HStack: React.FC<Omit<IStackProps, 'direction'>> = (props) => (
  <Stack direction="horizontal" {...props} />
);

/**
 * 纵向的stack
 */
export const VStack: React.FC<Omit<IStackProps, 'direction'>> = (props) => (
  <Stack direction="vertical" {...props} />
);

export type IAutoStackProps = Omit<IStackProps, 'direction'> & {
  /**
   * 自适应方向的断点, 屏幕尺寸小于等于时则使用纵向, 其他情况使用横向
   * * sm, S: 断点为 768px
   * * md, M: 断点为 1200px
   * @default 'xs'
   */
  breakpoint?: Exclude<IViewportSize, 'xl' | 'lg'>;
};

/**
 * 自适应的stack
 * 自适应方向, 小屏幕使用纵向, 其他情况使用横向
 * @param breakpoint 'xs' | 'sm', 默认 xs 屏幕尺寸小于等于时则使用纵向, 其他情况使用横向
 * @param props
 * @returns
 */
export function AutoStack({ breakpoint = 'sm', ...props }: IAutoStackProps) {
  const size = useResponsive();
  const direction = compareViewportSize(size, breakpoint) > 0 ? 'horizontal' : 'vertical';
  return <Stack direction={direction} {...props} />;
}
