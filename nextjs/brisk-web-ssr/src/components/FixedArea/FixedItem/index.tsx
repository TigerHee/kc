import React from 'react';
import styles from './styles.module.scss';
import clsx from 'clsx';

const FixedItem = (
  { children, className, ...props }:
  { children: React.ReactNode, className?: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>
) => {
  return <a className={clsx(styles.fixedItem, className)} {...props}>{children}</a>;
};

export default FixedItem;
