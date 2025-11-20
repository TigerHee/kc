/**
 * Owner: larvide.peng@kupotech.com
 *
 * @description Text component
 */
import { clx } from '@/common';
import './style.scss';

export interface ITextProps {
  /**
   * 渲染标签类型
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'a' | 'p' | 'div';
  /**
   * 链接
   */
  href?: string;
  /**
   * 类名
   */
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

/**
 * Text component
 */
export function Text({ children, as = 'span', href, className, ...props }: ITextProps) {
  const buttonClassNames = clx('kux-text', `${className || ''}`, {
    'kux-text_link': as === 'a',
  });
  const Tag = as;

  const accessibilityProps = {
    'aria-label': props['aria-label'] || null,
    'aria-labelledby': props['aria-labelledby'] || null,
  };

  const linkProps = href ? { href } : {};
  return (
    <Tag className={buttonClassNames} {...linkProps} {...accessibilityProps} {...props}>
      {children}
    </Tag>
  );
}
