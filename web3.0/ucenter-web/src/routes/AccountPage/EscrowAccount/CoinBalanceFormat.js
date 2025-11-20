/**
 * Owner: john.zhang@kupotech.com
 */

import NumberFormat from 'src/components/common/NumberFormat';
import { numberFixed } from 'src/helper';
import { useSelector } from 'src/hooks/useSelector';

const CoinBalanceFormat = ({ count, currency }) => {
  const categories = useSelector((state) => state.categories);
  const coin = categories[currency];

  return currency ? <NumberFormat>{numberFixed(count, coin?.precision || 8)}</NumberFormat> : null;
};

export default CoinBalanceFormat;
