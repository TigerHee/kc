import { Currency } from "@/types/currency";
import { create } from "zustand";
import { UpdatePropAction } from "@/store/base";
import createStoreProvider from "gbiz-next/createStoreProvider";
import { bootConfig } from "kc-next/boot";
import { getPrices, getRates } from "@/services/currency";
import storage from "gbiz-next/storage";
import { getTenantConfig } from "@/config/tenant";


type CurrencyActions = {
  pullRates: () => Promise<void>;
  pullPrices: (currency?: string, user?: any) => Promise<void>;
  selectCurrency: (
    payload: { currency?: string; reloadUser?: boolean },
    logined?: boolean
  ) => void;
};

type CurrencyStoreState = Currency &
  UpdatePropAction<Currency> &
  CurrencyActions;

// 泰国站白名单币种
const TH_CURRENCY_WHITELIST = ["USD", "THB"];

export const createCurrencyStore = (
  initial: Partial<CurrencyStoreState> = {}
) => {
  // bootconfig初始化比较慢，必须执行时取值!
  const initialCurrencyState: Currency = {
    currency: bootConfig._DEFAULT_RATE_CURRENCY_,
    currencyList: [],
    prices: {},
    rates: {},
  };

  return create<CurrencyStoreState>((set, get) => ({
    ...initialCurrencyState,
    ...initial,
    pullRates: async () => {
      const currencyList: string[] = [];
      let rates = {};
      try {
        const { data } = await getRates(
          getTenantConfig().ratesBaseCurrency
        );
        if (data) {
          for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
              // 泰国站只允许白名单币种
              if (bootConfig._BRAND_SITE_ === 'TH') {
                if (TH_CURRENCY_WHITELIST.includes(key)) {
                  currencyList.push(key);
                }
              } else {
                currencyList.push(key);
              }
            }
          }
          rates = data;
        }
      } catch (e) {
        console.log("pullRates Error", e);
      }
      get().updateProp({
        currencyList,
        rates,
      });
    },
    pullPrices: async (currency?: string, user?: any) => {
      let nowCurrency = currency;
      if (!currency) {
        const storageCurrency = storage.getItem("currency");
        nowCurrency =
          storageCurrency && storageCurrency !== "null"
            ? storageCurrency
            : bootConfig._DEFAULT_RATE_CURRENCY_;
        if (user && user.currency && user.currency !== "null") {
          nowCurrency = user.currency;
        } else if (nowCurrency === "CNY") {
          // 从缓存拿的CNY需要处理成USD
          nowCurrency = "USD";
          storage.setItem("currency", "USD");
        }
      }
      const { data } = await getPrices(nowCurrency);
      get().updateProp({
        currency: nowCurrency,
        prices: data || {},
      });
    },
    selectCurrency: (
      payload: { currency?: string; reloadUser?: boolean },
      logined = false
    ) => {
      const nowCurrency = payload.currency && payload.currency !== 'null' ? payload.currency : bootConfig._DEFAULT_RATE_CURRENCY_;
      get().updateProp({ currency: nowCurrency });
      storage.setItem('currency', nowCurrency);
    },
    updateProp(payload) {
      set(payload);
    },
  }));
};

export const {
  StoreProvider: CurrencyStoreProvider,
  useStoreValue: useCurrencyStore,
} = createStoreProvider<CurrencyStoreState>("currency", createCurrencyStore);
