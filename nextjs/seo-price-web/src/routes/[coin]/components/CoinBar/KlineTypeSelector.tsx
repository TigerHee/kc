/**
 * Owner: will.wang@kupotech.com
 */
import { useCallback } from 'react';
import { useUpdateEffect } from 'ahooks';
import { saTrackForBiz } from '@/tools/ga';
import styles from './KlineTypeSelectorStyles.module.scss';
import  storage from 'gbiz-next/storage';
import Image from 'next/image';
import clsx from 'clsx';

import CandleIcon from '@/assets/coinDetail/kline-candle.svg';
import LineIcon from '@/assets/coinDetail/kline-line.svg';

const KlineTypeSelector = ({ klineType, setKlineType }) => {
  const handleChangeType = useCallback(() => {
    const _type = klineType === 'line' ? 'candle' : 'line';
    storage.setItem('klineType', _type);
    setKlineType(_type);
  }, [klineType, setKlineType]);

  useUpdateEffect(() => {
    try {
      saTrackForBiz({}, ['Switch', klineType === 'line' ? '2' : '1']);
    } catch (e) {
      console.log('e', e);
    }
  }, [klineType]);

  return (
    <div className={styles.wrapper} data-inspector="price-kline-type" onClick={handleChangeType}>
      <div className={clsx(styles.iconWrapper, klineType === 'line' && styles.active)}>
        <Image width={10} height={10} src={LineIcon} alt="line" />
      </div>
      <div className={clsx(styles.iconWrapper, klineType === 'candle' && styles.active)}>
        <Image width={10} height={10} src={CandleIcon} alt="candle" />
      </div>
    </div>
  );
};

export default KlineTypeSelector;