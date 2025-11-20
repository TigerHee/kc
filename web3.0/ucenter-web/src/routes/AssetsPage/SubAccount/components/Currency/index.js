/**
 * Owner: solar@kupotech.com
 */
import { moduleFederation } from '@kucoin-biz/common-base';
import { useTheme } from '@kux/mui';
import { useSelector } from 'src/hooks/useSelector';
import { useAssetsList } from './hooks';
const { init, loadRemote } = moduleFederation;

// 加载组件
const SubCurrencyTable = loadRemote('assets-web/SubCurrencyTable');

export default () => {
  const prices = useSelector((state) => state.currency.prices);
  const fiatCurrency = useSelector((state) => state.currency.currency);
  const { data, loading } = useAssetsList();
  const { currentTheme } = useTheme();

  return (
    <SubCurrencyTable
      data={data}
      loading={loading}
      prices={prices}
      fiatCurrency={fiatCurrency}
      theme={currentTheme}
    />
  );
};
