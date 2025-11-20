/**
 * Owner: roger@kupotech.com
 */

/**
 * 将交易对code转换为展示用的name
 */
import React, { FC } from 'react';
import { PREFIX } from '../../common/constants';
import CoinIcon from '../CoinIcon';
import { useHeaderStore } from 'packages/header/Header/model';
import styles from './styles.module.scss';

interface SymbolCodeToNameProps {
  code: string;
  noIcon?: boolean;
  divide?: string;
  icon?: string;
}

export const namespace = `${PREFIX}_header`;

const SymbolCodeToName: FC<SymbolCodeToNameProps> = ({ code = '', noIcon, divide = '/', icon }) => {
  const baseCurrency = code?.split('-')?.[0];
  const quoteCurrency = code?.split('-')?.[1];
  const coinsCategorys = useHeaderStore(state => state.coinsCategorys);
  return (
    <>
      {noIcon ? null : <CoinIcon icon={icon} coin={baseCurrency} />}
      <span className={styles.baseCurrencyBox}>
        <span className={styles.baseCurrencyWrapper}>
          {coinsCategorys?.[baseCurrency]?.currencyName || baseCurrency}
        </span>
        <span className={styles.quoteCurrencyWrapper}>{`${divide}${
          coinsCategorys?.[quoteCurrency]?.currencyName || quoteCurrency
        }`}</span>
      </span>
    </>
  );
};

export default SymbolCodeToName;
