/**
 * Owner: will.wang@kupotech.com
 */
import fp from 'lodash/fp';
import { useMemo } from 'react';
// import { ReactComponent as NodataIcon } from '@/assets/price/trade-nodata.svg';
import NodataIcon from '@/assets/price/trade-nodata.svg';
import SymbolItem from './SymbolItem';
import { useCoinDetailStore } from '@/store/coinDetail';
import styles from './style.module.scss';
import clsx from 'clsx';
import useTranslation from '@/hooks/useTranslation';
import { groupBy } from 'lodash-es';


const TradeTab = ({ visible }) => {
  const tradingPairs = useCoinDetailStore((state) => state.tradingPairs);
  const symbolSet = useMemo(() => groupBy(tradingPairs, 'symbol'), [tradingPairs]);
  const {_t } = useTranslation();

  const renderItem = (item, idx) => {
    return <SymbolItem info={symbolSet[item]} key={item} />;
  };

  return (
    <div
      className={clsx(styles.wrapper, {
        [styles.visible]: visible,
      })}
    >
      {tradingPairs.length ? (
        <ul className={styles.container}>{fp.pipe(Object.keys, fp.map(renderItem))(symbolSet)}</ul>
      ) : (
        <div className={styles.noData}>
          <img src={NodataIcon} style={{ marginTop: '32px' }} />
          <p className={styles.noDataText}>{_t('oo6UaLAFMN8gUxUqsZHHz2')}</p>
        </div>
      )}
    </div>
  );
};

export default TradeTab;