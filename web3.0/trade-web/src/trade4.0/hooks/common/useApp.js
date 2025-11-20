/*
 * Owner: garuda@kupotech.com
 */

import { useSelector } from 'react-redux';

import JsBridge from '@kucoin-base/bridge';

export const isInApp = () => JsBridge.isApp();

export const setAppInfo = ({ dispatch }) => {
  JsBridge.open(
    {
      type: 'func',
      params: {
        name: 'getAppInfo',
      },
    },
    (params) => {
      dispatch({
        type: 'app/setAppInfo',
        payload: params.data,
      });
    },
  );
};

export const useAppInfo = () => {
  return useSelector((state) => state.user.appInfo);
};
