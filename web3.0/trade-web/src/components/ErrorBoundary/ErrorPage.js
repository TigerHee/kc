/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { noop } from 'lodash';
import { connect } from 'dva';
import clxs from 'classnames';
import { _t } from 'utils/lang';
import styles from './style.less';

import ErrorComputer from 'assets/error_computer.svg';

const ErrorPage = ({ currentLangReady }) => {
  // 待国际化完成初始化再显示文本
  const transitionLang = currentLangReady ? _t : noop;
  // 帮助中心地址
  const helpCenterUrl = '/support';
  // 刷新
  const reload = () => {
    window.location.reload();
  };
  // 跳转帮助中心
  const routeToHelpCenter = () => {
    const newWindow = window.open(helpCenterUrl);
    newWindow.opener = null;
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.leftBox}>
          <div className={styles.title}>{transitionLang('error.page.title')}😴</div>
          <div className={styles.describe}>{transitionLang('error.page.info1')}</div>
          <div className={styles.describe}>{transitionLang('error.page.info2')}</div>
          <div className={styles.btnGroup}>
            <button className={clxs(styles.btn, styles.reload)} onClick={reload}>
              {transitionLang('error.page.reload')}
            </button>
            <button className={clxs(styles.btn, styles.link)} onClick={routeToHelpCenter}>
              {transitionLang('error.page.help')}
            </button>
          </div>
        </div>
        <div
          className={styles.rightBox}
          style={{ backgroundImage: `url(${ErrorComputer})` }}
        />
      </div>
    </div>
  );
};

export default connect((state) => {
  const { currentLangReady } = state.app;
  return {
    currentLangReady,
  };
})(ErrorPage);
