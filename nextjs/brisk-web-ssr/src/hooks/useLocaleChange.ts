import { changeLocale } from 'kc-next/i18n';
import { setUserLocaleUsingPost } from '@/api/ucenter';
import { useUserStore } from '@/store/user';
import { kucoinv2Storage as storage } from 'gbiz-next/storage';
import { localeToLang } from 'kc-next/i18n';

export default function useLocaleChange() {
  const user = useUserStore((state) => state.user);

  return async (nextLocale: string, donotChangeUser = false) => {
    if (user && user.language !== nextLocale && !donotChangeUser) {
      await setUserLocaleUsingPost({ language: localeToLang(nextLocale) });
    }
    storage.setItem('lang', localeToLang(nextLocale));
    changeLocale(nextLocale);
  };
}
