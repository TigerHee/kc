/*
 * @owner: borden@kupotech.com
 */
import { useSelector } from 'dva';
import { getStateFromStore } from '@/utils/stateGetter';
import { numberFormat, dateTimeFormat } from '@kux/mui/utils';

// 数字本地化
export function useIntlFormatNumber({ lang, ...other }) {
  const currentLang = useSelector((state) => state.app.currentLang);
  return numberFormat({ lang: lang || currentLang, ...other });
}

// 日期本地化
export function useIntlFormatDate({ lang, ...other }) {
  const currentLang = useSelector((state) => state.app.currentLang);
  return dateTimeFormat({ lang: lang || currentLang, ...other });
}
/**
 * 下面是get类方法，由于trade-web整个layout会在语言初始化完成后才render, 所以可以直接用get方法不用管update
 * 初始化逻辑见 src/components/App/index.js
 */
// 数字本地化getter
export function intlFormatNumber({ lang, ...other }) {
  const currentLang = getStateFromStore((state) => state.app.currentLang);
  return numberFormat({ lang: lang || currentLang, ...other });
}

// 日期本地化getter
export function intlFormatDate({ lang, ...other }) {
  const currentLang = getStateFromStore((state) => state.app.currentLang);
  return dateTimeFormat({ lang: lang || currentLang, ...other });
}
