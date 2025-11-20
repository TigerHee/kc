import React from 'react';
import { useCategoriesStore } from '@/store/categories';

interface CoinData {
  currencyName?: string;
  [key: string]: any;
}

interface CoinCodeToNameProps {
  coin: string;
  fallback?: string;
  className?: string;
}

const CoinCodeToName: React.FC<CoinCodeToNameProps> = ({
  coin,
  fallback,
  className
}) => {
  const { categories } = useCategoriesStore();

  if (!coin) {
    return null;
  }

  const coinObj = categories?.[coin] as CoinData | undefined;
  const displayName = coinObj?.currencyName || fallback || coin;

  return (
    <span className={className}>
      {displayName}
    </span>
  );
};

export default CoinCodeToName;
