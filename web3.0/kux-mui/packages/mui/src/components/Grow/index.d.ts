/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IGrowProps {
  /**
   * The content node to be collapsed.
   */
  children?: React.ReactNode;

  /**
   * If `true`, the component will transition in.
   */
  in?: boolean;
}

declare const Grow: React.ForwardRefRenderFunction<HTMLDivElement, IGrowProps>;

export default Grow;
