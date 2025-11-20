/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import styles from './style.less';
import bg from 'assets/investment/new/labBg.png';
import bgImage from 'assets/investment/welcome_bg.jpg';
import { useIsMobile } from 'components/Responsive';

const AnimateBg = () => {
  const isMobile = useIsMobile();

  return (
    <div className={styles.bg}>
      <img inspector="bg" src={isMobile ? bgImage : bg} alt="" />
    </div>
  );
};

export default AnimateBg;
