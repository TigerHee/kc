/**
 * Owner: odan.ou@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { KUCOIN_HOST } from 'utils/siteConfig';
import { useIsMobile } from 'components/Responsive';
import { Event } from 'helper';
import styles from './style.less';
import logo from 'assets/investment/new/labs.png';
import logo_h5 from 'assets/investment/new/labs_h5.png';
import JumpImg from 'components/img/JumpImg'

/**
 * Kucionlabs Header
 * @param {{
 *  data: {
 *    link: string,
 *    mediaContent: string
 *  }[]
 * }} props 
 * @returns 
 */
const Header = (props) => {
  const { data = [] } = props
  const isMobile = useIsMobile()
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

  const isHeadTransparent = isOnTop;

  return (
    <div className={styles.affix}>
      <div className={styles.head} data-theme={isHeadTransparent ? 'transparent' : undefined}>
        <div className={styles.limit}>
          <div className={styles.headLeft}>
            {/* <a href={queryPersistence.formatUrlWithStore(KUCOIN_HOST)} className={styles.logo}>
            <img src={isMobile?logo_h5:logo} alt="KuCoin" />
            </a> */}
            <img src={isMobile?logo_h5:logo} alt="KuCoin" />
          </div>
          <div className={styles.link}>
            {
              data.map(({ id, mediaContent, link }) => (
                <JumpImg key={id} imgUrl={mediaContent} link={link} className="link-wrap" width={34} height={34}/>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
