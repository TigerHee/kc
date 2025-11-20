/**
 * Owner: john.zhang@kupotech.com
 */

import { Button } from '@kux/mui';
import LottieThemeIcon from 'src/components/LottieThemeIcon';
import styles from './LayoutComponent.module.scss';
import clsx from 'clsx';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

interface WrapperProps {
  children: React.ReactNode;
  isApp?: boolean;
  className?: string;
  [key: string]: any;
}

export const Container: React.FC<ContainerProps> = ({ children, className, ...props }) => (
  <div className={clsx(styles.container, className)} {...props}>
    {children}
  </div>
);

export const Wrapper: React.FC<WrapperProps> = ({ children, isApp, className, ...props }) => (
  <section className={clsx(styles.wrapper, isApp && styles.isApp, className)} {...props}>
    {children}
  </section>
);

export const SubTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
  ...props
}) => (
  <p className={clsx(styles.subTitle, className)} {...props}>
    {children}
  </p>
);

export const StatusIcon: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  className,
  ...props
}) => <img className={clsx(styles.statusIcon, className)} {...props} />;

export const CustomButton: React.FC<any> = ({ className, ...props }) => (
  <Button className={clsx(styles.customButton, className)} {...props} />
);

export const LottieIcon: React.FC<any> = ({ className, ...props }) => (
  <LottieThemeIcon className={clsx(styles.lottieIcon, className)} {...props} />
);
