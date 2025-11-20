/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import classname from 'classname';
import { get } from 'lodash';
import { FOOTER_CONFIG } from '../config';
import { addLangToPath } from 'utils/lang';
import siteConfig from 'utils/siteConfig';
import styles from './style.less';

const Footer = ({ namespace = 'luckydrawTurkey' }) => {
  const { isInApp } = useSelector(state => state.app);
  const modalData = useSelector(state => state[namespace]);
  const channelCode = get(modalData, 'config.channelCode', '');
  const isAe = get(modalData, 'isAe', false);
  const content = FOOTER_CONFIG[namespace];
  return isInApp ? null : (
    <div className={styles.footer} id="luckydraw_footer">
      <div className={styles.inner}>
        <div className={styles.iconWrap}>
          <a
            href={addLangToPath(siteConfig.KUCOIN_HOST)}
            onClick={(e)=>{
              e.preventDefault();
              const url = content.homeUrl(channelCode) ||
              addLangToPath(`${siteConfig.KUCOIN_HOST}${window.location.search}`);
              window.open(url,"_blank");
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={window._BRAND_LOGO_} alt="logo"  fetchpriority="low" />
          </a>
          <div className={styles.follow}>
            <div className={styles.followWords}>{content.follow}</div>
            <div>
              {content.community.map((item, index) => (
                <a
                  key={`community_${index}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className={classname(styles.communityIcon, {
                      [styles.communityIconRever]: isAe,
                    })}
                    src={item.icon}
                    alt=""
                    fetchpriority="low"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.driver} />
        <div className={styles.copyRight}>{content.copyRight}</div>
      </div>
    </div>
  );
};

export default Footer;
