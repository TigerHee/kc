/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { replace } from 'utils/router';

export default () => {
  replace('/markets/new-cryptocurrencies'); // ⚠️ 原路由废弃 新页面迁移到markets下
  return null;
};
