/*
 * @owner: borden@kupotech.com
 */
import useEventCallback from 'hooks/useEventCallback';
import { createContext, FC, ReactNode, useContext } from 'react';
// TODO: 需要迁移common-service
import { useCurrenciesFetch, useSymbolsFetch, step2precision } from 'packages/common-service';
import { maxPrecision, expireDuration, useHeaderStore } from '../Header/model';

const FetchContext = createContext<{
  pullCurrencies: () => void;
  pullSymbols: () => void;
}>({
  pullCurrencies: () => {},
  pullSymbols: () => {},
});



export const CommonServiceProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const updateHeader = useHeaderStore(s => s.updateHeader)

  const { run: currenciesFetch } = useCurrenciesFetch({
    manual: true,
    params: { domainIds: 'kucoin' },
    staleTime: expireDuration, // 跟原来的保持一致
    onSuccess: (resData) => {
      if (!resData?.kucoin) return;
      const categories = {};

      Object.values(resData.kucoin).forEach((item: any) => {
        // precision(item.coin, item.precision); // @TODO 没用上
        item.key = item.currency;
        item.precision = parseInt(item.precision || maxPrecision, 10);
        categories[item.currency] = item;
      });

      updateHeader?.({ coinsCategorys: categories });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { run: symbolsFetch } = useSymbolsFetch({
    manual: true,
    staleTime: expireDuration, // 跟原来的保持一致
    onSuccess: (resData) => {
      const symbols: any[] = [];
      const symbolsMap = {};
      // 扩充字段
      Object.values(resData).forEach((item: any) => {
        item.symbol = item.symbolCode; // 交易对code
        item.symbolName = item.symbol; // 交易对名称（与杠杆的数据一致）
        item.basePrecision = step2precision(item.baseIncrement);
        item.pricePrecision = step2precision(item.priceIncrement);
        item.quotePrecision = step2precision(item.quoteIncrement);
        symbolsMap[item.code] = item;
        symbols.push(item);
      });
      updateHeader?.({ symbols, symbolsMap });
    },
    onError: (error) => {
     console.log(error);
    },
  });

  // 拉取币种配置
  const pullCurrencies = useEventCallback(async () => {
    currenciesFetch();
  });
  // 拉取币对配置
  const pullSymbols = useEventCallback(async () => {
    symbolsFetch();
  });

  return (
    <FetchContext.Provider value={{ pullCurrencies, pullSymbols }}>
      {children}
    </FetchContext.Provider>
  );
};

export function useCommonService() {
  return useContext(FetchContext);
}
