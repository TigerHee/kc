/**
 * Owner: lori@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import _ from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _t } from 'tools/i18n';

export default ({ children }) => {
  const dispatch = useDispatch();
  const isInApp = JsBridge.isApp();
  const { appReady } = useSelector((state) => state.app);

  useEffect(() => {
    if (isInApp) {
      dispatch({ type: 'app/init' });
    }
  }, [dispatch, isInApp]);

  useEffect(() => {
    appReady && _.delay(handleJSOpen, 300);
  }, [appReady, handleJSOpen]);

  const handleJSOpen = useCallback(() => {
    JsBridge.open({
      type: 'event',
      params: {
        name: 'onPageMount',
      },
    });
  }, []);

  // 更新app内header
  useEffect(() => {
    if (isInApp) {
      JsBridge.open({
        type: 'event',
        params: {
          name: 'updateHeader',
          title: _t('selfService.resetGoogle'),
          rightVisible: false,
        },
      });
      window.onListenEvent('onLeftClick', () => {
        JsBridge.open({
          type: 'func',
          params: { name: 'exit' },
        });
        return true;
      });
    }
  }, [isInApp]);

  return <React.Fragment>{children}</React.Fragment>;
};
