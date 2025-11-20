/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IBadgeProps {
  /**
   * 不展示数字，只有一个小红点
   */
  dot?: boolean;

  /**
   * 设置 Badge 为状态点
   */
  status?: 'success';

  /**
   * 当数值为 0 时，是否展示 Badge
   */
  showZero?: boolean;

  /**
   * 展示封顶的数字值
   */
  overflowCount?: number;

  /**
   * 展示的数字，大于 overflowCount 时显示为 ${overflowCount}+，为 0 时隐藏
   */
  count?: number;
}

declare const Badge: React.ForwardRefRenderFunction<HTMLDivElement, IBadgeProps>;

export default Badge;
