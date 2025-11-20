/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IEmptyProps {
  size?: 'small' | 'large';
  name?: 'no-record' | 'network-error' | 'suspension-of-trading' | 'system-busy';
  description?: React.ReactNode;
  subDescription?: React.ReactNode;
}

declare const Empty: React.ForwardRefRenderFunction<HTMLDivElement, IEmptyProps>;

export default Empty;
