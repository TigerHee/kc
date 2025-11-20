/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useIsLarge } from 'hooks/mediaQuery';
import JumpLink from '../JumpLink';
import styles from './style.less';
import commonStyles from '../index.less';
import tradeSvg from 'assets/consensus/trade.svg';
import igoImg from 'assets/consensus/igo.png';
import igoMidImg from 'assets/consensus/igo-mid.png';

const IndividualInvestors = ({ config }) => {
  const { title1, list1, title2, list2, title3, list3, title4, list4 } = config;
  const isLarge = useIsLarge();

  const renderInfo = (title, list) => {
    return (
      <div>
        <h2 className={commonStyles.commonTabTitle}>{title}</h2>
        <div className={styles.tabContent}>
          {list.map(el => (
            <div key={el.title}>
              <h3 className={commonStyles.commonInfoTitle}>{el.title}</h3>
              <div>
                {el.desc.map((it, index) => (
                  <p className={commonStyles.commonInfoDesc} key={`desc_${index}`}>
                    {it}
                  </p>
                ))}
              </div>
              <span>{el.link ? <JumpLink {...el.link} /> : null}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.out}>
      <img className={styles.bigWord} src={tradeSvg} alt="" />
      <div>{renderInfo(title1, list1)}</div>
      <div className={styles.imgBox}>
        <img className={styles.igoImg} src={isLarge ? igoImg : igoMidImg} alt="IGO" />
      </div>
      <div>{renderInfo(title2, list2)}</div>
      <div>{renderInfo(title3, list3)}</div>
      <div>{renderInfo(title4, list4)}</div>
    </div>
  );
};

export default IndividualInvestors;
