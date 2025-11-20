/**
 * Owner: larvide.peng@kupotech.com
 *
 * @description Tab child component
 */

import { clx } from '@/common';

interface ITabProps {
  children: React.ReactNode;
  className?: string;
}

export function Tab({ children, className }: ITabProps) {
  return <div className={clx('tab', className)}>{children}</div>;
}