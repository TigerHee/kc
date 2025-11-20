/**
 * Owner: larvide.peng@kupotech.com
 *
 * @description Tooltip component
 */
import React, { type ReactNode } from 'react';
import { IPopoverProps, Popover } from '@/components/popover';
import { useIsMobile } from '@/hooks';
import { Modal } from '@/components/modal';
import { getConfig } from '@/setup';
import { clx } from '@/common';

import './style.scss';

export interface ITooltipProps extends IPopoverProps {
  /**
   * 移动端 tooltip 弹窗的标题, 不提供则使用组件库配置 getToolTipTitle 方法获取
   */
  title?: ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Tooltip component
 */
export function Tooltip(props: ITooltipProps) {
  const isMobile = useIsMobile();

  const clickHandler = () => {
    Modal.info({
      content: props.content,
      title: props.title || getConfig('getTooltipTitle', true),
      cancelText: null,
      headerBorder: false,
      footerBorder: false,
      okText: getConfig('getOkText', true),
      onShow: props?.onShow,
      onHide: props?.onHide,
    });
  };
  // 根据设计规范移动端全部由click触发
  if (isMobile) {
    return (
      <div className={clx('kux-tooltip', props.className)} onClick={clickHandler}>
        {props.children}
      </div>
    );
  }

  return (
    <Popover
      {...props}
      className={clx('kux-tooltip', props.className)}
      trigger={props.trigger}
    >
      {props.children}
    </Popover>
  );
}
