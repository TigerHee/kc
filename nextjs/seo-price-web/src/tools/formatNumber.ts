/**
 * Owner: iron@kupotech.com
 */
import Decimal from 'decimal.js';
import numberFixed from './numberFixed';
import separateNumber from './separateNumber';
import { bootConfig } from 'kc-next/boot';
import { isNaN, isNil } from 'lodash-es';

const { _DEFAULT_LANG_ } = bootConfig;

export const dropZero = (str) => {
  if (!str) return 0;
  const e = new Decimal(str);
  return e.toFixed();
};


export const readableNumber = (value) => {
  const million = 1000000;
  const number = parseFloat(value);

  if (Number.isNaN(number)) {
    return value;
  }
  if (number < million) {
    return separateNumber(value);
  }

  return separateNumber(numberFixed(number, 2));
};

export default (num, precision?: number) => {
  if (typeof +num !== 'number' || Number.isNaN(+num)) {
    return num;
  }
  return separateNumber(dropZero(numberFixed(num, precision)));
};


export const numSeparateDecimal = (num, interceptDigits = 2) => {
  if (isNil(num) || isNaN(num) || !num) return 0;
  let stringNum = '' + num;
  let stringNumArray = stringNum.split('.');
  if (stringNumArray.length <= 1) return parseFloat(stringNum);
  if (stringNumArray[1].length > interceptDigits) {
    const n1 = stringNumArray[1].slice(0, interceptDigits);
    stringNumArray.splice(1, 1, n1);
    return parseFloat(stringNumArray.join('.'));
  }
  return +num;
};

export const formatLocalLangNumber = ({
  lang = _DEFAULT_LANG_,
  data,
  options = {},
  interceptDigits = null,
}: any) => {
  const num = +data;
  if (isNil(data) || isNaN(data) || typeof num !== 'number') return data;
  const _lang = lang.replace('_', '-');
  const numberFormat = new Intl.NumberFormat(_lang, {
    ...{ maximumFractionDigits: 8 },
    ...options,
  });
  let result;
  let newNum = num;
  if (!isNil(interceptDigits) && typeof interceptDigits === 'number' && interceptDigits >= 0) {
    newNum = numSeparateDecimal(newNum, interceptDigits);
  }
  result = numberFormat.format(newNum);
  return result;
};
