/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import { Event } from 'helper';
import siteConfig from 'utils/siteConfig';
import LangSelector from 'components/Header/LangSelector';
import { addLangToPath } from 'utils/lang';
import styles from './style.less';

const Header = () => {
  const [isOnTop, setIsOnTop] = useState(true);

  useEffect(() => {
    const handler = () => {
      let isTop = true;
      try {
        isTop = document.documentElement.scrollTop <= 80;
      } catch (e) {
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

  return (
    <div className={styles.affix} inspector="header">
      <div className={styles.header} data-theme={isOnTop ? 'transparent' : undefined}>
        <a href={addLangToPath(siteConfig.KUCOIN_HOST)} target="_blank" rel="noopener noreferrer">
          <img src={window._BRAND_LOGO_} alt="logo" />
        </a>

        <LangSelector />
      </div>
    </div>
  );
};
export default Header;
