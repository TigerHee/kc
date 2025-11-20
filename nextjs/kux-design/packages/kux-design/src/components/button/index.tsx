/**
 * Owner: larvide.peng@kupotech.com
 *
 * @description Button component
 */
import type { MouseEvent, ReactNode, CSSProperties } from 'react';
import { clx } from '@/common';
import { useSingletonCallback } from '@/hooks';
import { Loading } from '@/components/loading';
import './style.scss';

export type TButtonType = 'primary' | 'default' | 'danger' | 'outlined' | 'text' | 'primary-text';

export interface IButtonProps {
  children: ReactNode;
  /**
   * 按钮类型
   * @default default
   */
  type?: TButtonType;
  /**
   * 尺寸
   * @default basic
   */
  size?: 'mini' | 'small' | 'large' | 'basic' | 'huge';
  /**
   * 点击回调是否为异步函数, 若为 false 则不会在按钮点击后显示loading状态, 避免使用同步函数时按钮闪烁
   */
  async?: boolean;
  /** 左侧icon */
  startIcon?: ReactNode;
  /** 右侧icon */
  endIcon?: ReactNode;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 加载状态
   * @default false
   */
  loading?: boolean;
  /**
   * 是否填充整个区域
   * @default false
   */
  fullWidth?: boolean;
  /**
   * 行内样式
   */
  style?: CSSProperties;
  /**
   * 点击事件
   */
  onClick?:
    | ((event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void | Promise<any>)
    | undefined;
  /**
   * 将按钮宽度调整为其父宽度的选项
   */
  block?: boolean;
  /**
   * 按钮跳转链接，如果启用此项则该组件以a标签渲染
   */
  href?: string | undefined;
  className?: string;
  /**
   * 按钮事件回调冷却时间, 单位 ms
   * @default 0
   * @description 用于防止用户频繁点击, 用于设置本次点击与上一次点击的最小时间间隔
   */
  coolDownTime?: number;
}

/**
 * Button component
 */
export function Button({
  onClick,
  children,
  type = 'default',
  loading = false,
  disabled = false,
  fullWidth = false,
  size = 'basic',
  style,
  block = false,
  className,
  href,
  startIcon,
  endIcon,
  coolDownTime = 0,
  async = false,
  ...rest
}: IButtonProps) {
  const [handleClick, isRunning] = useSingletonCallback(
    onClick,
    loading || disabled || false,
    coolDownTime,
    !async,
  );

  const isLoading = isRunning || loading;

  const buttonClassNames = clx(
    'kux-button',
    `kux-button-${type}`,
    `kux-button-${size}`,
    `${className ?? ''}`,
    {
      'is-full-width': fullWidth,
      'is-disabled': disabled,
      'kux-button-full': block,
      'kux-button-start-ico': !!startIcon && !isLoading,
      'kux-button-end-ico': !!endIcon && !isLoading,
    },
  );
  const Tag = href ? 'a' : 'button';
  const AAttr = href ? { href } : {};
  const haveIco = !!startIcon || !!endIcon;

  return (
    <Tag
      data-testid="kux-button"
      className={buttonClassNames}
      onClick={handleClick}
      disabled={disabled || isLoading}
      style={style}
      {...AAttr}
      {...rest}
    >
      {isLoading ? (
        <div className="kux-button-loading" data-testid="loading-ico">
          <Loading type="normal" size="custom" />
        </div>
      ) : null}
      {!!startIcon && !isLoading && (
        <>
          <div className="kux-button-ico kux-button-start" data-testid="start-icon">
            {startIcon}
          </div>
          {!!children && <div className="kux-button-fill"></div>}
        </>
      )}
      {!isLoading && (
        <span
          className={clx('kux-button-content', {
            'kux-button-content-large': size === 'large',
            // 没有图标时，文字居中
            'kux-button-content-align-center': !haveIco,
          })}
        >
          {children}
        </span>
      )}
      {!!endIcon && !isLoading && (
        <>
          {!!children && <div className="kux-button-fill"></div>}
          <div className="kux-button-ico kux-button-ico-end" data-testid="end-icon">
            {endIcon}
          </div>
        </>
      )}
    </Tag>
  );
}
