/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo, useMemo } from 'react';
import { map } from 'lodash';
import { Popover } from 'antd';
import { setTwoDimensionalArray } from 'src/utils/array'
import { useIsMobile } from 'components/Responsive';
import KSlider from '../components/KSlider'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './style.less';

/**
 * Kucoinlabs Portfolio
 * @param {{
 *  data: {
 *    link: string,
 *    mediaContent: string,
 *    id: string,
 *    title: string,
 *    content: string,
 *  }[]
 * }} props
 */
const Portfolio = (props) => {
  const { data = []} = props
  const isMobile = useIsMobile();
  const formatList = useMemo(() => {
    return setTwoDimensionalArray(data, isMobile ? 12 : 15);
  },[data, isMobile])
  const openPage = (e,url) => {
    e.preventDefault();
    const newTab = window.open(url, '_blank');
    newTab.opener = null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div inspector="portfolio_title" className={styles.title}>
          {window._BRAND_NAME_} Labs Portfolio
        </div>
      </div>
      <div inspector="portfolio_items" className={styles.portfolioWrapper}>
        <KSlider data={formatList} slidesToShow={1} render={(itemList) => {
            return (
              <div className={styles.portfolio}>
                {map(itemList, ({ title, content, link, mediaContent, id }) => {
                  return (
                    <Popover
                      key={id}
                      title={title}
                      content={content}
                      overlayClassName={styles.portfolioStyle}
                    >
                      <a href={link} className={styles.item} onClick={(e) => openPage(e,link)}>
                        <div>
                          <img src={mediaContent} alt="img" />
                        </div>
                      </a>
                    </Popover>
                  );
                })}
              </div>
            );
          }}/>
      </div>
    </div>
  );
};

export default memo(Portfolio);
