/**
 * Owner: john.zhang@kupotech.com
 */

import styles from './StyledComponents.module.scss';

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className, ...props }) => (
  <div className={`${styles.dialogHeader} ${className || ''}`} {...props}>
    {children}
  </div>
);
