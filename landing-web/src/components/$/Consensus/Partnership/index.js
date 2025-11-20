/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState } from 'react';
import { useIsSmall } from 'hooks/mediaQuery';
import JumpLink from '../JumpLink';
import styles from './style.less';
import commonStyles from '../index.less';
import glowImg from 'assets/consensus/partner-glow.png';

const Partnership = ({ config }) => {
  const { list = [], title, imgSrc, tailText, tailLink } = config;
  const isSmall = useIsSmall();

  let finalList = [];
  if (isSmall) {
    finalList = [list.slice(0, 3), list.slice(3)];
  } else {
    finalList = [list.slice(0, 3), [{ type: 'image' }, ...list.slice(3)]];
  }

  const renderParagraph = el => {
    const { tailLinks } = el;
    return (
      <div className={styles.infoBox} key={el.title}>
        <h3 className={commonStyles.commonInfoTitle}>{el.title}</h3>
        <p className={commonStyles.commonInfoDesc}>{el.desc}</p>
        <>
          {tailLinks.map(link => (
            <div key={link.url}>
              <JumpLink {...link} />
            </div>
          ))}
        </>
      </div>
    );
  };

  const renderContents = () => {
    const [left, right] = finalList;
    return (
      <>
        <>{left.map(renderParagraph)}</>
        <>
          {right.map(el => {
            if (el.type === 'image') {
              return (
                <div className={styles.imgBox}>
                  <img className={styles.glowImg} src={glowImg} alt="" />
                  <img className={styles.img} src={imgSrc} alt="" />
                </div>
              );
            }
            return renderParagraph(el);
          })}
        </>
      </>
    );
  };

  return (
    <div className={styles.out}>
      <div className={styles.bigWords} />
      <h2 className={commonStyles.commonTabTitle}>{title}</h2>
      <div className={styles.tabContent}>{renderContents()}</div>
      <p className={`${commonStyles.commonFoot} ${styles.foot}`}>
        <span>{tailText}</span> <JumpLink {...tailLink} />
      </p>
    </div>
  );
};

export default Partnership;
