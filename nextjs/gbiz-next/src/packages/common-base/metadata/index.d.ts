declare module '@kucoin-gbiz-next/metadata' {
  /**
   * 支持的币种代码联合类型
   */
  type CurrencyCode = 
    | 'EUR' | 'INR' | 'BRL' | 'PEN' | 'CHF' | 'KES' | 'USD' | 'NGN' | 'CNY' | 'PHP'
    | 'UAH' | 'RUB' | 'ILS' | 'TWD' | 'BGN' | 'SAR' | 'COP' | 'UGX' | 'ZAR' | 'DKK'
    | 'NZD' | 'KZT' | 'MAD' | 'THB' | 'PKR' | 'BOB' | 'TRY' | 'ARS' | 'BDT' | 'MXN'
    | 'SEK' | 'HUF' | 'HRK' | 'JPY' | 'AED' | 'CAD' | 'AUD' | 'EGP' | 'MNT' | 'RON'
    | 'IDR' | 'PLN' | 'HKD' | 'VND' | 'GBP' | 'CZK' | 'VES';

  /**
   * 币种符号类型
   */
  type CurrencySymbol = 
    | '€' | '₹' | 'R$' | 'S/.' | 'CHF' | 'KSh' | '$' | '₦' | '¥' | '₱'
    | '₴' | '₽' | '₪' | 'NT$' | 'лв' | 'ر.س' | 'COL$' | 'USh' | 'R' | 'KR'
    | 'NZ$' | '₸' | 'م.د.' | '฿' | '₨' | '$b' | '₺' | 'ARS$' | '৳' | 'Mex$'
    | 'kr' | 'Ft' | 'kn' | 'د.إ' | 'C$' | 'A$' | '£' | '₮' | 'lei'
    | 'Rp' | 'zł' | 'HKD' | '₫' | 'Kč' | 'Bs';

  /**
   * 精确的币种映射表类型
   */
  type CurrencyMap = {
    EUR: '€';
    INR: '₹';
    BRL: 'R$';
    PEN: 'S/.';
    CHF: 'CHF';
    KES: 'KSh';
    USD: '$';
    NGN: '₦';
    CNY: '¥';
    PHP: '₱';
    UAH: '₴';
    RUB: '₽';
    ILS: '₪';
    TWD: 'NT$';
    BGN: 'лв';
    SAR: 'ر.س';
    COP: 'COL$';
    UGX: 'USh';
    ZAR: 'R';
    DKK: 'KR';
    NZD: 'NZ$';
    KZT: '₸';
    MAD: 'م.د.';
    THB: '฿';
    PKR: '₨';
    BOB: '$b';
    TRY: '₺';
    ARS: 'ARS$';
    BDT: '৳';
    MXN: 'Mex$';
    SEK: 'kr';
    HUF: 'Ft';
    HRK: 'kn';
    JPY: '¥';
    AED: 'د.إ';
    CAD: 'C$';
    AUD: 'A$';
    EGP: '£';
    MNT: '₮';
    RON: 'lei';
    IDR: 'Rp';
    PLN: 'zł';
    HKD: 'HKD';
    VND: '₫';
    GBP: '£';
    CZK: 'Kč';
    VES: 'Bs';
  };

  /**
   * 币种数组项类型
   */
  interface CurrencyItem {
    currency: CurrencyCode;
    char: CurrencySymbol;
  }

  /**
   * 币种数组类型
   */
  type CurrencyArray = CurrencyItem[];

  /**
   * 币种字符表
   */
  export const currencyMap: CurrencyMap;

  /**
   * 币种字符表，数组形式
   */
  export const currencyArray: CurrencyArray;
}