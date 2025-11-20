import { HTMLAttributes } from "react";
import styles from './style.module.scss';
import clsx from "clsx";

export const Tabs = (props: HTMLAttributes<HTMLDivElement>) => {
  const { className, ...rest } = props;

  return <div className={clsx(styles.tabs, className)} {...rest} />
};

export const Tab = (props: HTMLAttributes<HTMLDivElement> & { active: boolean; }) => {
  const { active, className, ...rest } = props;

  return (
    <div className={clsx(styles.tab, className, {
      [styles.active]: active,
    })} {...rest} />
  )
};
