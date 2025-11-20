/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IStatusProps {
  name?: 'error' | 'loading' | 'success' | 'warning';
}

declare const Status: React.ForwardRefRenderFunction<HTMLDivElement, IStatusProps>;

export default Status;
