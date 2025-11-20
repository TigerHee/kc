/**
 * Owner: iron@kupotech.com
 */
import { useTranslation } from "tools/i18n";


// 将接收的值中的 '.' 替换成 '_'
// function useTransT(t) {
//   return function translationLang(key, option) {
//     const keys = _.isString(key) ? key.replace(/\./g, '_') : key;
//     return t(keys, option);
//   };
// }

export default function useLang() {
  const translation = useTranslation('header');

  return translation;
}
