import * as React from 'react';

export interface BreadcrumbProps {
  children: React.ReactNode;
  size?: 'basic' | 'small';
}

declare const Breadcrumb: React.FC<BreadcrumbProps>;
export default Breadcrumbs;
