/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IFadeProps {
  /**
   * The content node to be collapsed.
   */
  children?: React.ReactNode;

  /**
   * If `true`, the component will transition in.
   */
  in?: boolean;
}

declare const Fade: React.ForwardRefRenderFunction<HTMLDivElement, IFadeProps>;

export default Fade;
