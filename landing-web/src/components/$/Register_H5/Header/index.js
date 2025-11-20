/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import siteConfig from 'utils/siteConfig';
import LangSelector from 'components/Header/LangSelector';
import { addLangToPath } from 'utils/lang';
import styles from './style.less';

const Header = () => {
  return (
    <div className={styles.header}>
      <a href={addLangToPath(siteConfig.KUCOIN_HOST)} target="_blank" rel="noopener noreferrer">
        <img src={window._BRAND_LOGO_} alt="logo" />
      </a>

      <LangSelector />
    </div>
  );
};
export default Header;
