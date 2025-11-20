/**
 * Owner: willen@kupotech.com
 */
import { create } from 'zustand';
import { bootConfig, getCurrentLang } from 'kc-next/boot';
import { kucoinv2Storage as storage } from 'gbiz-next/storage';
import { ratesUsingGet, getPricesV2UsingGet } from '@/api/currency';
import { useUserStore } from './user';

interface CurrencyState {
  currency: string | null;
  currencyList: string[];
  rates: Record<string, string>;
  prices: Record<string, string>;
  pullRates: () => Promise<void>;
  pullPrices: (currency?: string) => Promise<void>;
  selectCurrency: (currency: string, reloadUser?: boolean, logined?: boolean) => Promise<void>;
  getCurrencyWithLogin: () => Promise<void>;
}

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currency: null,
  currencyList: [],
  rates: {},
  prices: {},

  pullRates: async () => {
    const currencyList: string[] = [];
    let rates: Record<string, string> = {};

    try {
      const { data } = await ratesUsingGet({
        base: bootConfig._DEFAULT_RATE_CURRENCY_!,
      });
      if (data) {
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            currencyList.push(key);
          }
        }
        rates = data;
      }
    } catch (e) {
      console.log(e);
    }

    set({
      currencyList,
      rates,
    });
  },

  pullPrices: async (currency?: string) => {
    try {
      let nowCurrency = currency;
      if (!currency) {
        const user = useUserStore.getState().user;
        const storageCurrency = storage.getItem('currency');
        nowCurrency =
          storageCurrency && storageCurrency !== 'null' ? storageCurrency : bootConfig._DEFAULT_RATE_CURRENCY_;

        if (user && user.currency && user.currency !== 'null') {
          nowCurrency = user.currency;
        } else if (nowCurrency === 'CNY') {
          // 从缓存拿的CNY需要处理成USD
          nowCurrency = bootConfig._DEFAULT_RATE_CURRENCY_;
          storage.setItem('currency', bootConfig._DEFAULT_RATE_CURRENCY_);
        }
      }

      const { data } = await getPricesV2UsingGet({
        base: nowCurrency!,
      });
      set({
        currency: nowCurrency,
        prices: data || {},
      });
    } catch (e) {
      console.log(e);
    }
  },

  selectCurrency: async (currency: string, reloadUser = true, logined = false) => {
    const user = useUserStore.getState().user;
    const nowCurrency = currency && currency !== 'null' ? currency : bootConfig._DEFAULT_RATE_CURRENCY_;

    if (user || logined) {
      await useUserStore.getState().setLocal({ currency: nowCurrency }, reloadUser);
    }

    set({ currency: nowCurrency });
    storage.setItem('currency', nowCurrency);
  },

  getCurrencyWithLogin: async () => {
    const user = useUserStore.getState().user;
    const beforeCurrency = get().currency;
    const _currency = user?.currency || storage.getItem('currency');

    // 登录后，只有currency发生了变化，再重新请求币服prices
    if (_currency !== beforeCurrency) {
      await get().pullPrices(user?.currency);
    }

    if (_currency) {
      await get().selectCurrency(_currency, user?.language === getCurrentLang() && !user?.currency, true);
    }
  },
}));
