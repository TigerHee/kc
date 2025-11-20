/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface ICollapseProps {
  /**
   * The content node to be collapsed.
   */
  children?: React.ReactNode;

  /**
   * The width (horizontal) or height (vertical) of the container when collapsed.
   * @default '0px'
   */
  collapsedSize?: string | number;

  /**
   * If `true`, the component will transition in.
   */
  in?: boolean;
}

declare const Collapse: React.ForwardRefRenderFunction<HTMLDivElement, ICollapseProps>;

export default Collapse;
