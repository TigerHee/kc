/**
 * Owner: larvide.peng@kupotech.com
 *
 * @description Statistic component
 * @see https://www.figma.com/design/D3Pp4F7sFpTkfSEFsQTm9e/%E5%A2%9E%E9%95%BF%E7%BB%84%E4%BB%B6?node-id=370-2660&m=dev
 */

import { useMemo, type ReactNode } from 'react';
import CountUp from './count-up';
import { clx, isRenderable } from '@/common';

import './style.scss';

export interface IStatisticProps {
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * 终值, 若非数值, 则不动画
   */
  value: number
  /**
   * 值前缀
   */
  prefix?: ReactNode;
  /**
   * 值后缀
   */
  suffix?: ReactNode;

  /**
   * 元素垂直方向的对齐方式
   * @default 'center'
   */
  align?: React.CSSProperties['alignItems'];
  /**
   * 数字时长
   */
  duration?: number;
  /** 计数过程小数保留位数 */
  decimals?: number;
  /**
   * 隐藏数值
   */
  hideAmount?: boolean;
  /**
   * 值隐藏时的内容, 默认为 ***
   */
  maskContent?: ReactNode;
  /**
   * 动画结束的回调
   */
  onFinish?: () => void;
}

/**
 * Statistic component
 */
export function Statistic(props: IStatisticProps) {
  const { prefix, suffix, align,
    className, style, value, maskContent = '***', ...countUp } = props;

  const wrapperClassName = clx('kux-statistic', props.className)
  const wrapperStyle = useMemo(() => {
    if (!props.style && !props.align) return undefined;
    if (!props.align) return props.style;
    if (!props.style) return { alignItems: props.align };
    return {
      ...props.style,
      alignItems: props.align,
    };
  }, [props.style, props.align])

  if (props.hideAmount) {
    return (
      <div className={wrapperClassName} style={wrapperStyle}>
        <div className="kux-statistic-mask">
          {maskContent}
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClassName} style={wrapperStyle}>
      {
        isRenderable(prefix)
        ? (<>
            <div className='kux-statistic-prefix'>{prefix}</div>
            <div className='kux-statistic-spacer' />
        </>)
        : null
      }
      <CountUp end={value} {...countUp} />
      {
        isRenderable(suffix)
        ? (<>
            <div className='kux-statistic-spacer' />
            <div className='kux-statistic-suffix'>{suffix}</div>
        </>)
        : null
      }
    </div>
  );
}
