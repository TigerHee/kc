/**
 * Owner: roger@kupotech.com
 */
import round from 'lodash-es/round';
import React from 'react';

import { toPercent } from 'tools/math';
import { formatLangNumber } from '../../../../common/tools';
import styles from './styles.module.scss';

interface PriceRateProps {
  rate: number;
  price: number;
  inDrawer?: boolean;
  lang: string;
}

const PriceRate = ({ rate, price, inDrawer, lang }: PriceRateProps) => {

  if (typeof rate !== 'number') {
    rate = +rate;
  }
  let color = 'var(--kux-text40)';
  let prefix = '';
  if (rate > 0) {
    color = '#01BC8D';
    prefix = '+';
  } else if (rate < 0) {
    color = 'var(--kux-secondary)';
  }
  if (inDrawer) {
    return (
      <div className={styles.h5Wrapper}>
        <span className={styles.priceWrapper} style={{ marginBottom: inDrawer ? '0px' : '4px' }}>
          {price ? formatLangNumber(price) : '--'}
        </span>
        <span className={styles.rateWrapper} style={{ color }}>
          {prefix}
          {toPercent(round(rate, 4), lang)}
        </span>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.priceWrapper} style={{ marginBottom: inDrawer ? '0px' : '4px' }}>
        {price ? formatLangNumber(price) : '--'}
      </span>
      <span className={styles.rateWrapper} style={{ color }}>
        {prefix}
        {toPercent(round(rate, 4), lang)}
      </span>
    </div>
  );
};

export default PriceRate;
