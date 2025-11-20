import { changeLocale } from 'kc-next/i18n';
import { setLocal } from '@/services/user';
import { kucoinv2Storage as storage } from 'gbiz-next/storage';
import { localeToLang } from 'kc-next/i18n';
import { useSelector } from 'react-redux';

export default function useLocaleChange() {
  // @ts-expect-error 暂不修复
  const user = useSelector((state) => state.user.user);

  return async (nextLocale: string, donotChangeUser = false) => {
    if (user && user.language !== nextLocale && !donotChangeUser) {
      await setLocal({ language: localeToLang(nextLocale) });
    }
    storage.setItem('lang', localeToLang(nextLocale));
    changeLocale(nextLocale);
  };
}
