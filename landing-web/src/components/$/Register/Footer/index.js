/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { _t, addLangToPath } from 'utils/lang';
import { useSelector } from 'dva';
import siteConfig from 'utils/siteConfig';
import CopyRight from 'src/components/common/CopyRight';
import facebookSvg from 'assets/registration/facebook.svg';
import twitterSvg from 'assets/registration/twitter.svg';
import telegramSvg from 'assets/registration/telegram.svg';
import styles from './style.less';

const Footer = () => {
  const { currentLang } = useSelector(state => state.app);
  return (
    <div className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.iconWrap}>
          <a href={addLangToPath(`${siteConfig.KUCOIN_HOST}`)} target="_blank" rel="noopener noreferrer">
            <img src={window._BRAND_LOGO_} alt="logo" />
          </a>
          <div className={styles.follow}>
            <div className={styles.followWords}>{_t('register.follow')}</div>
            <a href="https://www.facebook.com/KuCoinOfficial" target="_blank" rel="noopener noreferrer" >
              <img className={styles.communityIcon} src={facebookSvg} alt="" />
            </a>
            <a href="https://twitter.com/KuCoinCom" target="_blank" rel="noopener noreferrer" >
              <img className={styles.communityIcon} src={twitterSvg} alt="" />
            </a>
            <a href="https://t.me/Kucoin_Exchange" target="_blank" rel="noopener noreferrer" >
              <img className={styles.communityIcon} src={telegramSvg} alt="" />
            </a>
          </div>
        </div>
        <div className={styles.driver} />
        <div className={styles.copyRight}>
          <CopyRight />
        </div>
      </div>
    </div>
  );
};

export default Footer;
