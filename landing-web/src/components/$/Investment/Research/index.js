/**
 * Owner: odan.ou@kupotech.com
 */
import React from 'react';
import { useIsMobile } from 'components/Responsive';
import KSlider from '../components/KSlider'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import researchImg from 'assets/investment/new/research.svg';
import styles from './style.less';

/**
 * Kucoinlabs Research
 * @param {{
 *  data: {
 *    link: string,
 *    id: string,
 *    title: string,
 *  }[]
 * }} props
 */
const Research = (props) => {
  const { data = [] } = props

  const isMobile = useIsMobile();
  const slidesToShow = Math.min(isMobile ? 2 : 3, data.length)

  const openPage = (e,link) => {
    e.preventDefault();
    const newTab = window.open(link, '_blank');
    newTab.opener = null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div inspector="research_title" className={styles.title}>
          {window._BRAND_NAME_} Labs Research
        </div>
      </div>
      <div className={styles.research}>
        <KSlider data={data} slidesToShow={slidesToShow} render={({ link, title, id }) => (
          <a key={id} href={link} className={styles.item} onClick={(e) => openPage(e,link)}>
            <img src={researchImg} alt="img" />
            <div style={{paddingLeft: 10, paddingRight: 10}}>{title}</div>
          </a>
        )} />
      </div>
    </div>
  );
};

export default Research;
