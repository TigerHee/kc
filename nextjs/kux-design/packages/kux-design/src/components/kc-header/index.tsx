/**
 * Owner: saiya.lee@kupotech.com
 *
 * @description KcHeader component
 */
import { forwardRef } from 'react'
import { ArrowLeft2Icon, ShareIcon } from '@kux/iconpack';
import { clx } from '@/common/style'
import './style.scss'

export interface IKcHeaderProps {
  className?: string;
  style?: React.CSSProperties;
  /**
   * 页面标题
   */
  title?: string;
  onClickBack?: (() => void) | undefined;
  onClickShare?: (() => void) | undefined;
  isInApp?: boolean;
  backBtn?: React.ReactNode;
  /**
   * 分享按钮, 设置为 null 则不显示, 为其他 falsy 值则使用默认分享按钮
   */
  shareBtn?: React.ReactNode;
}

/**
 * KcHeader component
 */
export const KcHeader = forwardRef<HTMLDivElement, IKcHeaderProps>(function KcHeader(props, ref) {
  return (
    <div
      ref={ref}
      style={props.style}
      className={clx('kux-kc-header', {'is-app': props.isInApp}, props.className)}>
      <div className='kux-kc-header_item'>
        {
          props.backBtn || (<BackButton onClickBack={props.onClickBack} />)
        }
      </div>
      <div className='kux-kc-header_title'>
        {props.title || ''}
      </div>
      <div className='kux-kc-header_item'>
        {props.shareBtn === null ? null : (props.shareBtn || (<ShareButton onClickShare={props.onClickShare} />))}
      </div>
    </div>
  )
});

function BackButton(props: Pick<IKcHeaderProps, 'onClickBack'>) {
  return (
    <ArrowLeft2Icon rtl data-testid='back-ico' onClick={props.onClickBack}/>
  )
}

function ShareButton(props: Pick<IKcHeaderProps, 'onClickShare'>) {
  return (
    <ShareIcon rtl data-testid='share-ico' onClick={props.onClickShare} />
  )
}
