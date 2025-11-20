/**
 * Owner: kevyn.yu@kupotech.com
 */
import { useTheme } from '@kux/mui-next';
import { useEffect, useState } from 'react';
import { useCoinDetailStore } from '@/store/coinDetail';
import useTranslation from '@/hooks/useTranslation';
import NumberFormatWithChar from '@/components/common/NumberFormatWithChar';
import Tip from '@/components/common/Tip';
import styles from './style.module.scss';

const DEFAULT_INFO = {};

export default () => {
  const { _t } = useTranslation();
  const {
    bestSymbol,
    latestPrice,
    coinInfo: { ath },
  } = useCoinDetailStore((state) => state);

  const tradeData = useCoinDetailStore((state) => bestSymbol ? (state.tradeData[bestSymbol] || null) : null);
  const { isUnsale, isTemporary } = useCoinDetailStore((state) => state.coinInfo || DEFAULT_INFO);
  const [currentPrice, setCurrentPrice] = useState(0);
  const theme = useTheme();
  const finalPrice = latestPrice || ath;

  useEffect(() => {
    if (!tradeData) {
      setCurrentPrice(0);
    } else {
      if (finalPrice && !currentPrice) {
        const rangeNum = Math.abs(
          Number(tradeData.highestPrice24h) - Number(tradeData.lowestPrice24h),
        );
        const tmpPrice =
          100 * (Math.abs(Number(finalPrice) - Number(tradeData.lowestPrice24h)) / rangeNum);
        setCurrentPrice(tmpPrice);
      }
    };

    
  }, [finalPrice, tradeData?.highestPrice24h, tradeData?.lowestPrice24h, currentPrice, tradeData]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <Tip
          text={_t('76mvn1yPS7pkW8x4pjGu8m')}
          spm={['currencyMoreInformation', '1']}
          sensorsData={{ position: 'PF' }}
        >
          <label>{_t('o5HsxtTm58kyT8hdJgf2E6')}</label>
        </Tip>
      </div>
      <div className={styles.highAndLowPrice}>
        <div className={styles.sliderWrapper}>

          <div className={styles.slider}></div>
        </div>
        <div className={styles.priceWrapper}>
          <div className={styles.labelWrapper}>
            <label>{_t('rgKPVfYRnaoXwFvDvNEcyB')}</label>
            <span>
              {(tradeData?.lowestPrice24h && bestSymbol) ? (
                <NumberFormatWithChar
                  isUnsaleATemporary={isUnsale || isTemporary}
                  price={tradeData.lowestPrice24h}
                  symbol={bestSymbol}
                />
              ) : (
                ' --'
              )}
            </span>
          </div>
          <div className={styles.labelWrapper}>
            <label>{_t('1Tqbn9nXkvkaG45Tru6iot')}</label>
            <span>
              {(tradeData?.highestPrice24h && bestSymbol) ? (
                <NumberFormatWithChar
                  isUnsaleATemporary={isUnsale || isTemporary}
                  price={tradeData.highestPrice24h}
                  symbol={bestSymbol}
                />
              ) : (
                ' --'
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};