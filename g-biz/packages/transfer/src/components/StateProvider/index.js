import { useEffect, useState, useMemo, createContext } from 'react';
import { getCoinsCategory, getAllSymbolConfigs, getCurrencyPrices } from '../../services';
import numberFixed from '../../utils/numberFixed';
import createDecimals from '../../utils/createDecimal';

export const StateContext = createContext();

const map = {
  'isHFAccountExist': {
    async fallback() {
      return false;
    },
    defaultValue: false,
  },
  'categories': {
    async fallback() {
      try {
        return await getCoinsCategory().then((res) => {
          const { data } = res;
          const maxPrecision = 8;
          const map = {};
          const coinNamesMap = {};
          const poolCoinsMap = {};
          const kumexCoinsMap = {};
          const list = [];
          data.pool.forEach((item) => {
            poolCoinsMap[item.currency] = item;
          });
          data.kumex.forEach((item) => {
            kumexCoinsMap[item.currency] = item;
          });
          data.kucoin.forEach((item) => {
            item.precision = parseInt(item.precision || maxPrecision, 10);
            const newItem = {
              ...item,
              key: item.currency,
              coin: item.currency,
              // icon: `${ASSETS_PATH}/${item.currency}.png`,
              step: numberFixed(1 / 10 ** item.precision),
              decimals: createDecimals(item.precision),
              isContractEnabled: !!kumexCoinsMap[item.currency],
              isPoolEnabled: !!poolCoinsMap[item.currency],
            };
            map[item.currency] = newItem;
            coinNamesMap[item.currencyName] = newItem;
            list.push(newItem);
          });
          return map;
        });
      } catch {
        return {};
      }
    },
    defaultValue: {},
  },
  'isolatedSymbolsMap': {
    async fallback() {
      try {
        return await getAllSymbolConfigs().then((res) => {
          return res?.data ?? [];
        });
      } catch {
        return [];
      }
    },
    defaultValue: [],
  },
  'prices': {
    async fallback({ userInfo }) {
      try {
        return await getCurrencyPrices({
          base: userInfo.currency,
        }).then((res) => res.data);
      } catch {
        return {};
      }
    },
    defaultValue: {},
  },
};

function useStateWithDefault(props = {}, key, ext) {
  const strategy = useMemo(() => map[key], [key]);
  const [state, setState] = useState(strategy.defaultValue);
  const isFallback = useMemo(() => {
    return !Object.prototype.hasOwnProperty.call(props, key);
  }, [props, key]);
  useEffect(() => {
    if (isFallback) {
      strategy.fallback(ext).then((_data) => {
        setState(_data);
      });
    }
  }, [isFallback, strategy]);
  return isFallback ? state : props[key];
}

export const StateProvider = ({ children, currentLang, theme, userInfo, ...props }) => {
  const isHFAccountExist = useStateWithDefault(props, 'isHFAccountExist');
  const categories = useStateWithDefault(props, 'categories');
  const isolatedSymbolsMap = useStateWithDefault(props, 'isolatedSymbolsMap');
  const prices = useStateWithDefault(props, 'prices', { userInfo });
  // const userPosition = useStateWithDefault(props, 'userPosition');

  const _props = useMemo(
    () => ({
      isHFAccountExist,
      categories,
      currentLang,
      userInfo,
      prices,
      isolatedSymbolsMap,
    }),
    [isHFAccountExist, categories, currentLang, userInfo, isolatedSymbolsMap, prices],
  );
  return <StateContext.Provider value={_props}>{children}</StateContext.Provider>;
};
