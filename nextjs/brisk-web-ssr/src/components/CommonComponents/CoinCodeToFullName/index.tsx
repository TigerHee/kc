import { useCategoriesStore } from '@/store/categories';
import React from 'react';

interface CoinCodeToFullNameProps {
  coin: string;
  disableFallback?: boolean;
}

const CoinCodeToFullName: React.FC<CoinCodeToFullNameProps> = ({
  coin,
  disableFallback = false
}) => {
  const { categories } = useCategoriesStore();
  const coinObj = categories?.[coin];

  const displayName = coinObj?.name || (disableFallback ? '' : coin);

  return <>{displayName}</>;
};

export default CoinCodeToFullName;
