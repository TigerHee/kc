/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';

import style from './style.less';

const ErrorPage = () => {
  const statusCode = useSelector(state => state.app.statusCode);
  const backHome = useSelector(state => state.app.backHome);

  const is404 = statusCode === 404;
  const title = is404 ? 'Sorry, the page you were looking for was not found.' :
    'An error has occurred or the server is being maintained. Please try again later.';
  // const title = note;

  return (
    <div className={style.error}>
      <div className={style.box} data-code={`${statusCode}`}>
        <h1 className={style.h1}>{title}</h1>
        {backHome && <a href={backHome} className={style.backHome}>Back To Home</a>}
      </div>
    </div>
  );
};

export default ErrorPage;
