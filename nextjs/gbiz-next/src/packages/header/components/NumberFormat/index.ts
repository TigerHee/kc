// 默认精度
const defaultOptions = { maximumFractionDigits: 8 };

interface NumberFormatOptions {
    lang: string,
    children: number | bigint | Intl.StringNumericLiteral,
    options?: Intl.NumberFormatOptions
}

export default function NumberFormat({ lang, children, options = {} }: NumberFormatOptions) {
    const _lang = (lang || 'en_US').replace('_', '-');
    const numberFormat = new Intl.NumberFormat(_lang, { ...defaultOptions, ...options });
    return numberFormat.format(children);
}
