/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import classname from 'classname';
import { _t, _tHTML } from 'utils/lang';
// import JoinButton from '../JoinButton';
import styles from './style.less';
import bgLeft from 'assets/investment/cd-bg-left.svg';
import bgRight from 'assets/investment/cd-bg-right.svg';

const JoinUs = () => {

  return (
    <div className={classname([styles.joinCard, 'wow', 'slideInUp'])}>
      <img src={bgLeft} alt="" data-role="left" />
      <img src={bgRight} alt="" data-role="right" />
      <div className={styles.info}>
        <h5>{_t('invest.cd.title')}</h5>
        <p>{_tHTML('invest.cd.des')}</p>
        {/* <JoinButton /> */}
      </div>
    </div>
  );
};

export default JoinUs;
