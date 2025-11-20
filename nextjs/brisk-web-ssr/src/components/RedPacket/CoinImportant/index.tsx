/**
 * Owner: willen@kupotech.com
 * CoinImportant component - converted to TypeScript with zustand
 */
import { useCategoriesStore } from '@/store/categories';
import { useCurrencyStore } from '@/store/currency';
import { numberFormat } from '@kux/mui-next/utils';
import Decimal from 'decimal.js';
import { getCurrentLang } from 'kc-next/boot';
import React from 'react';
import multiplyFloor from '../utils/multiplyFloor';
import numberFixed from '../utils/numberFixed';
import styles from './styles.module.scss';

const dropZero = (str: string | number): string => {
  if (!str) return '-';
  return numberFormat({ number: str, lang: getCurrentLang() });
};

const Spacer: React.FC = () => <div className={styles.spacer} />;

interface CoinImportantProps {
  coin: string;
  value: string | number;
  isInTable?: boolean;
}

// 数值大的展示在上方
const CoinImportant: React.FC<CoinImportantProps> = ({ coin, value, isInTable = false }) => {
  const { currency, prices } = useCurrencyStore();
  const { categories: coinDict } = useCategoriesStore();

  const rate = prices[coin] || 1;
  const coinObj = coinDict[coin];

  // 数字货币
  const realValue = coinObj ? numberFixed(value, coinObj.precision) : value;
  // 法币
  let target: React.ReactNode = dropZero(multiplyFloor(rate, value, 2));
  // 先展示数字货币
  // @ts-expect-error 需要验证
  const firstShowCoin = Decimal(realValue).toNumber() > multiplyFloor(rate, value, 2);

  if (+value === 0 || +target !== 0) {
    target = (
      <span>
        <span>≈</span> {target}
      </span>
    );
  } else {
    target = (
      <span>
        &lt; <span>0.01</span>
      </span>
    );
  }

  return firstShowCoin ? (
    <div className={styles.wrapper} style={{ alignItems: isInTable ? 'flex-end' : 'center' }}>
      <span className={isInTable ? styles.commonAmount : styles.biggerAmount}>
        {dropZero(realValue)}
        <Spacer />
        <span>{coin}</span>
      </span>
      <span className={`color-gray ${styles.smallFontSize}`}>
        <span>{target}</span>
        <Spacer />
        <span>{currency}</span>
      </span>
    </div>
  ) : (
    <div className={styles.wrapper} style={{ alignItems: isInTable ? 'flex-end' : 'center' }}>
      <span className={isInTable ? styles.commonAmount : styles.biggerAmount}>
        <span>{target}</span>
        <span className={isInTable ? '' : styles.coinUnit}>{currency}</span>
      </span>
      <span className={`color-gray ${styles.smallFontSize}`}>
        {dropZero(realValue)}
        <Spacer />
        <span>{coin}</span>
      </span>
    </div>
  );
};

export default CoinImportant;
