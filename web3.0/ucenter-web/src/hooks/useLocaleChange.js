/**
 * Owner: iron@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { useSelector } from 'react-redux';
import { setLocal } from 'services/user';

export default function () {
  const { changeLocale } = useLocale();
  const user = useSelector((state) => state.user.user);

  return async (nextLocale, donotChangeUser = false) => {
    if (user && user.language !== nextLocale && !donotChangeUser) {
      await setLocal({ language: nextLocale });
    }

    changeLocale(nextLocale);
  };
}
