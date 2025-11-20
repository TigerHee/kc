/**
 * Owner: will.wang@kupotech.com
 */
import clsx from 'clsx';
import styles from './style.module.scss';
import { HTMLAttributes, ReactNode } from 'react';

export default ({ title, className, ...restProps }: Omit<HTMLAttributes<HTMLHeadingElement>, 'title'> & {
  title: ReactNode;
}) => {
  return (
    <h2 className={clsx(styles.wrapper, className)} {...restProps}>
      {title}
    </h2>
  );
};