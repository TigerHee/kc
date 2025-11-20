/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { _t, _tHTML } from 'utils/lang';
import { get } from 'lodash';
import { useSelector } from 'dva';
import styles from './index.less';

const LuckyGuy = ({ namespace = 'newCoinCarnival' }) => {
  const { config } = useSelector(state => state[namespace]);
  const firstUrl = get(config, 'param.firstUrl', '');
  if (!firstUrl) {
    return null;
  }

  return (
    <div className={styles.container} inspector="lucky_guy">
      <h2 className={styles.title}>{_t('newCoin.prize.title')}</h2>
      <img src={firstUrl} alt="LuckyGuy" />
    </div>
  );
};

export default LuckyGuy;
