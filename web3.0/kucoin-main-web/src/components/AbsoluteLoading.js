/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { Spin } from '@kufox/mui';
import style from './style.less';

const AbsoluteLoading = (props) => {
  return <Spin className={style.loading} {...props} />;
};

export default AbsoluteLoading;
