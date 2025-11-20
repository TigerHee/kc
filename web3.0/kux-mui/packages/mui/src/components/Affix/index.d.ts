/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IAffixProps {
  /**
   * 距离窗口顶部达到指定偏移量后触发, 默认0
   */
  offsetTop?: number;

  /**
   * 距离窗口底部达到指定偏移量后触发 默认无
   */
  offsetBottom?: number;

  /**
   * 固定状态改变时触发的回调函数
   */
  onChange?: (status: boolean) => void;

  /**
   * 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数
   */
  target?: () => HTMLElement;
}

declare const Affix: React.FC<IAffixProps>;

export default Affix;
