/**
 * Owner: willen@kupotech.com
 */
import { useCategoriesStore } from '@/store/categories';

const CoinCodeToName = (props: { coin: string; }) => {
  const coinDict = useCategoriesStore(s => s.coinDict);
  const { coin } = props;
  const coinObj = coinDict[coin];
  return <span>{coinObj ? coinObj.currencyName : coin}</span>;
};

export default CoinCodeToName;
