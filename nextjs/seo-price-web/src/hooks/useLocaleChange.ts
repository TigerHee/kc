/**
 * Owner: iron@kupotech.com
 */
import { changeLocale } from "kc-next/i18n";
import * as userService from "@/services/user";
import { useUserStore } from "@/store/user";
import { kucoinv2Storage as nsStorage } from "gbiz-next/storage";
import { localeToLang } from "kc-next/i18n";

export default function useLocaleChange() {
  const user = useUserStore((state) => state.user);

  return async (nextLocale: string, donotChangeUser = false) => {
    if (user && user.language !== nextLocale && !donotChangeUser) {
      await userService.setLocal({ language: localeToLang(nextLocale) });
    }
    nsStorage.setItem("lang", localeToLang(nextLocale));
    changeLocale(nextLocale);
  };
}
