/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IAccordionProps {
  /**
   * 手风琴模式 默认 false
   */

  accordion?: boolean;
  /**
   * 带边框风格的折叠面板 默认 false
   */

  bordered?: boolean;
  /**
   * 当前激活 tab 面板的 key，默认无
   */
  activeKey?: Array<string | number> | string | number;

  /**
   * 初始化选中面板的 key
   */
  defaultActiveKey?: Array<string | number> | string | number;

  /**
   * 自定义切换图标
   */
  expandIcon?: (status: boolean) => React.ReactNode;

  /**
   * 切换面板的回调
   */
  onChange?: (key: string | string[]) => void;

}

export interface IAccordionPanelProps {
  /**
   * 面板头内容
   */
  header?: React.ReactNode;

  /**
   * 对应 activeKey
   */
  key: React.Key;
}

declare const Accordion: React.ForwardRefRenderFunction<HTMLDivElement, IAccordionProps> & {
  AccordionPanel: React.FC<IAccordionPanelProps>;
};

export default Accordion;
