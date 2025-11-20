/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { addLangToPath } from '@/tools/i18n';
import styles from './styles.module.scss';

interface ErrorPageProps {
  query?: {
    statusCode?: number | string;
  };
  statusCode?: number | string;
}

// 这个组件从 gbiz-next 可以做一个 Module Component 出来
const ErrorPage: React.FC<ErrorPageProps> = ({ query, statusCode }) => {
  const code = Number(statusCode ?? query?.statusCode ?? 500);

  const is404 = code === 404;
  const title = is404
    ? 'Sorry, the page you were looking for was not found.'
    : 'An error has occurred or the server is being maintained. Please try again later.';
  // const title = note;

  return (
    <div className={styles.error}>
      <div className={styles.box} data-code={`${statusCode}`}>
        <h1 className={styles.h1}>{title}</h1>
        <a href={addLangToPath('/')} className={styles.backHome}>
          Back To Home
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
