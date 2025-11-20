/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'hooks';
import keysEquality from 'utils/tools/keysEquality'
import JsBridge from 'utils/jsBridge';
import { _t } from 'utils/lang';
import { openPage } from 'helper';
import { map } from 'lodash';
import styles from './style.less';

import { DEPOSIT_FAQ_LIST, WITHDRAW_FAQ_LIST } from './config';
import videoIcon from 'assets/deposit-withdraw/video.svg';
import articleIcon from 'assets/deposit-withdraw/article.svg';
import pointIcon from 'assets/deposit-withdraw/icon.svg';

const FAQ = (props) => {
  const { viewType } = props || {};
  const { currentLang, appInfo, isInApp } = useSelector(state => state.app, keysEquality(
    ['currentLang', 'appInfo', 'isInApp']
  ));
  const { darkMode } = appInfo || {};
  const isCN = useMemo(() => currentLang === 'zh_CN', [currentLang]);
  const clickLink = (linkItem) => {
    const url = isCN ? linkItem.cnLink : linkItem.enLink;
    // 打开链接
    // const newTab = window.open(url, '_blank');
    // newTab.opener = null;
    openPage(isInApp, url)
  };
  useEffect(() => {
    if (darkMode) return;
    JsBridge.open({
      type: 'event',
      params: {
        name: 'updateHeader',
        visible: true,
        title: '',
        leftVisible: true,
        rightVisible: false,
        background: '#FFFFFF',
        statusBarTransparent: false,
        statusBarIsLightMode: true,
      },
    });
  }, [darkMode]);

  const questionList = viewType === 'deposit' ? DEPOSIT_FAQ_LIST : WITHDRAW_FAQ_LIST;
  if (!questionList) return null;
  return (
    <div className={`${styles.page} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.title}>{_t('deposit.new.faq')}</div>
      <div className={styles.list}>
        {map(questionList, (item) => {
          return (
            <div className={styles.item} key={item.key}>
              <img src={item.type === 'video' ? videoIcon : articleIcon} className={styles.icon} alt="" />
               {/* eslint-disable-next-line react/jsx-no-target-blank */}
              <a
                className={styles.link}
                target="_blank"
                href={isCN ? item.cnLink : item.enLink}
                onClick={(e) => {
                  e.preventDefault();
                  clickLink(item);
                }}
              >
                {_t(item.key)}
              </a>
              <img src={pointIcon} className={styles.pointer} alt="" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;