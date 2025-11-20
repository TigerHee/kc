/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import { Button } from '@kufox/mui';
import { RightOutlined } from '@kufox/icons';
import { openPage } from 'helper';
import { useIsMiddle } from 'hooks/mediaQuery';
import styles from './style.less';
import commonStyles from '../index.less';
import gemsSvg from 'assets/consensus/gems.svg';
import applyImg from 'assets/consensus/apply.png';
import applyMidImg from 'assets/consensus/apply-mid.png';

const Listing = ({ config }) => {
  const { title, list, btnText, applyLink } = config;
  const { isInApp } = useSelector(state => state.app);
  const isMid = useIsMiddle();

  const goApply = () => {
    openPage(isInApp, applyLink);
  };

  return (
    <div className={styles.out}>
      <img className={styles.bigWord} src={gemsSvg} alt="" />
      <h2 className={commonStyles.commonTabTitle}>{title}</h2>
      <div className={styles.tabContent}>
        {list.map(el => (
          <div key={el.title}>
            <h3 className={commonStyles.commonInfoTitle}>{el.title}</h3>
            <p className={commonStyles.commonInfoDesc}>{el.desc}</p>
          </div>
        ))}
      </div>
      <div className={styles.imgBox}>
        <img className={styles.applyImg} src={isMid ? applyMidImg : applyImg} alt="" />
        <Button className={styles.btnStyle} onClick={goApply}>
          <span>{btnText}</span>
          <RightOutlined className="ml-6" />
        </Button>
      </div>
    </div>
  );
};

export default Listing;
