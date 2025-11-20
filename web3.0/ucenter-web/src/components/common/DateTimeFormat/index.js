/**
 * Owner: willen@kupotech.com
 */

import { useLocale } from '@kucoin-base/i18n';

const defaultOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hourCycle: 'h23',
};

export default function DateTimeFormat({ children, options = {}, hideTime = false, defaultLang }) {
  const { currentLang } = useLocale();

  const _lang = (currentLang || window._DEFAULT_LANG_).replace('_', '-');
  const dateTimeFormat = new Intl.DateTimeFormat(defaultLang || _lang, {
    ...defaultOptions,
    // 不展示时分秒
    ...(hideTime ? { hour: undefined, minute: undefined, second: undefined } : {}),
    ...options,
  });
  // 这个组件如果传了字符串 或者 moment(null) 会 crash
  return typeof children === 'string' ? '' : dateTimeFormat.format(children);
}
