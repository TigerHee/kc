import { RTL_Langs } from 'config';
import Big from 'big.js';

// 默认精度
const defaultOptions = { maximumFractionDigits: 20 };

// options isPositive
// currency $
export default function NumberFormat({ lang, number, isPositive, currency = '', options = {} }) {
  try {
    // 解决由于Intl插入国际化标识符引起的反转问题
    const absNumber = new Big(number).abs();
    const _lang = (lang || 'en_US').replace('_', '-');
    // 得到带千分位的结果
    const formater = new Intl.NumberFormat(_lang, { ...defaultOptions, ...options });
    const validNumber = formater.format(absNumber);

    // 判断符号
    const positive = +number < 0 ? '-' : isPositive ? '+' : '';
    // 需要反转的语言, % 单独处理
    if (options.style === 'percent') {
      if (RTL_Langs.includes(lang)) {
        const num = `\u202D${validNumber.replace('%', '')}\u202C`;
        return `\u202E${positive}${num}%\u202C`; // -10.23%，页面上会自动转
      }
      return `${positive}${validNumber}`;
    }
    return `${positive}${currency}${validNumber}`;
  } catch (e) {
    console.log('e:', e);
    return number;
  }
}
