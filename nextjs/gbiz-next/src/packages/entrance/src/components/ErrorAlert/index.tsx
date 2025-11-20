/**
 * Owner: sean.shi@kupotech.com
 */
import React from 'react';
import styles from './index.module.scss';
import { Alert } from '@kux/design';

interface ErrorAlertProps {
  msg?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ msg }) => {
  if (!msg) return null;
  return (
    <section className={styles.tipContainer} data-inspector="error-alert">
      <Alert
        className={styles.alertWrapper}
        message={msg}
        duration={0}
        size="basic"
        type="error"
      />
    </section>
  );
};