/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo } from 'react';
import { useIsLarge } from 'hooks/mediaQuery';
import JumpLink from '../JumpLink';
import styles from './style.less';
import commonStyles from '../index.less';
import glowImg from 'assets/consensus/bins-glow.png';

const InstitutionalInvestors = ({ config }) => {
  const { list = [], title, imgSrc, tailText, tailLink } = config;
  const isLarge = useIsLarge();
  const finalList = useMemo(() => {
    if (isLarge) {
      return [...list.slice(0, 3), { type: 'image' }, ...list.slice(3), { type: 'link' }];
    } else {
      return [...list.slice(0, 5), { type: 'image' }, { type: 'link' }];
    }
  }, [list, isLarge]);

  const renderParagraph = el => {
    if (el.type === 'image') {
      return (
        <div className={styles.imgBox}>
          <img className={styles.glowImg} src={glowImg} alt="" />
          <img className={styles.img} src={imgSrc} alt="" />
        </div>
      );
    }

    if (el.type === 'link') {
      return (
        <p className={`${commonStyles.commonFoot} ${styles.foot}`}>
          <span>{tailText}</span> <JumpLink {...tailLink} />
        </p>
      );
    }

    return (
      <div className={styles.infoBox} key={el.title}>
        <h3 className={commonStyles.commonInfoTitle}>{el.title}</h3>
        <p className={commonStyles.commonInfoDesc}>{el.desc}</p>
      </div>
    );
  };

  return (
    <div className={styles.out}>
      <div className={styles.bigWords} />
      <h2 className={commonStyles.commonTabTitle}>{title}</h2>
      <div className={styles.tabContent}>{finalList.map(renderParagraph)}</div>
    </div>
  );
};

export default React.memo(InstitutionalInvestors);
