// 默认精度
const defaultOptions = { maximumFractionDigits: 8 };

export default function NumberFormat({ lang, children, options = {} }) {
  const _lang = (lang || 'en_US').replace('_', '-');
  const numberFormat = new Intl.NumberFormat(_lang, { ...defaultOptions, ...options });
  return numberFormat.format(children);
}
