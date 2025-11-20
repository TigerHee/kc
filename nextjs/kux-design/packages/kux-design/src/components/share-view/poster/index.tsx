/**
 * Owner: saiya.lee@kupotech.com
 *
 * @description Poster component
 */
import { forwardRef, type CSSProperties, type ReactNode } from 'react';
import { clx } from '@/common';
import { type IPosterFooter, renderFooter } from './footer';
export * from './utils'

import './style.scss'

/**
 * 海报尺寸
 * 建议: { width: 265, height: 454 }
 */
export interface IPosterSize {
  /**
   * 海报宽度
   */
  width: number;
  /**
   * 海报高度
   */
  height: number;
}

export interface IPosterProps {
  /**
   * 海报名称, 保存时使用
   */
  name?: string;
  /**
   * 自定义样式类名
   */
  className?: string;
  /**
   * 用户邀请码, 未登陆则不传
   */
  rcode?: string;
  /**
   * 自定义样式
   */
  style?: CSSProperties;
  /**
   * 活动链接地址
   * @default location.href
   */
  link?: string;
  /**
   * 海报尺寸
   */
  size: IPosterSize
  /**
   * 海报主体内容
   */
  children: ReactNode;
  /**
   * 海报背景图片地址
   */
  background?: string;
  /**
   * 海报底部文案
   * * 不传没有底部文案
   * * 传 IPosterFooter 则使用默认底部文案
   * * 传 ReactNode 会替换默认底部文案
   */
  footer?: ReactNode | IPosterFooter;
}

/**
 * Poster component
 */
export const Poster = forwardRef(function Poster(props: IPosterProps, ref: React.Ref<HTMLDivElement>) {
  const shareLink = props.link || location.href;
  const style = {...props.style, ...props.size}
  const contentStyle = props.background ? {backgroundImage: `url(${props.background})`} : {}
  return (
    <div
      ref={ref}
      className={clx('kux-poster', props.className)}
      style={style}>
        <div
          className='kux-poster_content'
          style={contentStyle}
          >
          {props.children}
        </div>
      {renderFooter(props.footer, { link: shareLink, rcode: props.rcode })}
    </div>
  )
})
