/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import { ThemeProvider, Button } from '@kufox/mui';
import { _t } from 'utils/lang';
import { useSelector } from 'dva';
import classnames from 'classname';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import JsBridge from 'utils/jsBridge';
import EmptyLight from 'assets/gembox/empty_light.png';
import EmptyDark from 'assets/gembox/empty_dark.png';
import styles from './style.less';

const Index = () => {
  const { isInApp, appInfo } = useSelector(state => state.app);
  const { darkMode } = appInfo || {};

  const onBack = useCallback(() => {
    if (isInApp) {
      JsBridge.open({
        type: 'func',
        params: {
          name: 'exit',
        },
      });
    }
  }, [isInApp]);

  useEffect(() => {
    if (isInApp) {
      JsBridge.open({
        type: 'event',
        params: {
          name: 'updateHeader',
          title: '',
          background: darkMode ? '#11151f' : '#ffffff',
          visible: false,
          leftVisible: true,
          rightVisible: false,
          statusBarTransparent: true,
          statusBarIsLightMode: !darkMode,
        },
      });
    }
  }, [darkMode, isInApp]);

  return (
    <ThemeProvider>
      <section className={classnames(styles.content, darkMode ? styles.dark : styles.light)} data-inspector="gemboxPage">
        <img src={darkMode ? EmptyDark : EmptyLight} alt="fail" />
        <p>{_t('7fqShAkFxpMiwQNVbmMeMz')}</p>
        <Button onClick={onBack} className={styles.btn}>
          {_t('sU5uonRjARrkjZqFnE6yvC')}
        </Button>
      </section>
    </ThemeProvider>
  );
};

export default brandCheckHoc(Index, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
