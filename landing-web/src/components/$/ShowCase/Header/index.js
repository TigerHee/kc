/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import Responsive from 'components/Responsive';
import { MAINSITE_HOST } from 'utils/siteConfig';
import LangSelector from 'components/Header/LangSelector';
// import { KUMEX_HOST } from 'utils/siteConfig';
import { Event } from 'helper';
import { ArrowLeftOutlined  } from '@kufox/icons';
import styles from './style.less';
// import logoEn from 'assets/brandUpgrade/logo_en.svg';
// import logoCn from 'assets/brandUpgrade/logo_zh.svg';
import { _t, addLangToPath } from 'utils/lang';

const Header = () => {

  const [isOnTop, setIsOnTop] = useState(true);

  useEffect(() => {
    const handler = () => {
      let isTop = true;
      try {
        isTop = document.documentElement.scrollTop <= 80;
      } catch(e) {
        console.error(e);
      }

      setIsOnTop(isTop);
    };
    Event.addHandler(window, 'scroll', handler);
    Event.addHandler(window, 'resize', handler);

    return () => {
      Event.removeHandler(window, 'scroll', handler);
      Event.removeHandler(window, 'resize', handler);
    };
  }, []);

  const handleGoBack = useCallback(() => {
    window.location.href = addLangToPath(MAINSITE_HOST);
  }, []);

  const isHeadTransparent = isOnTop;
  // const isCN = lang.indexOf('zh_') === 0;
  return (
    <div className={styles.affix}>
      <div className={styles.head} data-theme={isHeadTransparent ? 'transparent' : undefined}>
        <div className={styles.limit}>
          <div className={styles.headLeft}>
            <div className={styles.backText} onClick={handleGoBack}>
              <ArrowLeftOutlined iconId="back" color="#fff" /> {_t('choice.head.back')}
            </div>
            {/* <a href={formatUtmAndRcodeUrl(KUMEX_HOST)} className={styles.logo}>
              <img src={isCN ? logoCn : logoEn} alt="KuCoin Futures" />
            </a> */}
          </div>
          <div className={styles.headRight}>
            <Responsive>
              <div className={styles.langSelect}>
                <LangSelector />
              </div>
            </Responsive>

            <Responsive.Mobile>
              <div className={styles.langSelectMb}>
                <LangSelector />
              </div>
            </Responsive.Mobile>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(state => {
  return {
    lang: state.app.currentLang,
  };
})(Header);
