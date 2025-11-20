/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { Spin } from '@kux/mui';
import style from './style.less';

const AbsoluteLoading = (props) => {
  return <Spin size="small" className={style.loading} {...props} />;
};

export default AbsoluteLoading;
