import { useCurrencyStore } from '@/store/currency';
import { useCategoriesStore } from '@/store/categories';
import { useUserStore } from '@/store/user';
import { useAppStore } from '@/store/app';
import { useEffect } from 'react';
import { useCurrenciesFetch, precision2step, precision2decimals } from 'gbiz-next/common-service';
import { kucoinv2Storage as storage } from 'gbiz-next/storage';
import { setCookies } from '@/api/setCookies';
import { manualTrack } from '@/tools/ga';

// 最大精度
const maxPrecision = 8;

export function useInitialData() {
  const { pullUser, isLogin } = useUserStore();
  const { getCurrencyWithLogin, pullPrices, pullRates } = useCurrencyStore();
  const { setCategories } = useCategoriesStore();
  const { pullCountryInfo, pullAppGpDownloadConfig } = useAppStore();

  useEffect(() => {
    pullUser();
    pullPrices();
    pullRates();
    pullCountryInfo();
    pullAppGpDownloadConfig();
  }, []);

  useCurrenciesFetch({
    params: { domainIds: 'kucoin' },
    onSuccess: (resData: any) => {
      let categories: any;
      if (resData?.kucoin) {
        categories = {};

        Object.values(resData.kucoin).forEach((item: any) => {
          item.key = item.currency;
          item.coin = item.currency;
          item.step = precision2step(item.precision);
          item.decimals = precision2decimals(item.precision);
          item.precision = parseInt(item.precision || maxPrecision, 10);

          categories[item.currency] = item;
        });
      }
      if (categories) {
        setCategories(categories);
      }

      manualTrack(['technology_event', '2'], {
        verify_result: 'success',
        bizType: 'brisk-web',
      });
    },
    onError: error => {
      manualTrack(['technology_event', '2'], {
        verify_result: 'fail',
        fail_reason: error?.toString(),
        bizType: 'brisk-web',
      });
    },
  });

  // 登录后的一些币服数据
  useEffect(() => {
    if (isLogin) {
      getCurrencyWithLogin();
    }
  }, [isLogin]);

  // 初始化主题，逻辑为
  // 1. 如果 localStorage 中设置了主题，则不做任何处理；也就是如果用户主动切过主题，以用户的为准；
  // 2. 如果 localStorage 中没有设置主题，则强制设置为 dark；也就是如果用户没切过主题，则主动设置为黑色；
  useEffect(() => {
    const storageTheme = storage.getItem('kc_theme', { isPublic: true });
    if (!storageTheme) {
      storage.setItem('kc_theme', 'dark', { isPublic: true });
      setCookies([{ name: 'kc_theme', value: 'dark' }]);
    }
  }, []);
}
