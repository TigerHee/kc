/**
 * Owner: kevyn.yu@kupotech.com
 */
import { CURRENCY_CHARS } from '@/config/base';
import { useCategoriesStore } from '@/store/categories';
import { useCurrencyStore } from '@/store/currency';
import { formatLocalLangNumber } from '@/tools/formatNumber';
import multiplyFloor from '@/tools/math/multiplyFloor';
import { useLang } from 'gbiz-next/hooks';

const DEFAULT_PRECESION = {};

const CoinCurrency = ({
  baseCurrency,
  coin,
  value,
  showType = 1,
  defaultValue,
  className,
  amountClassName,
  currencyClassName,
  useLegalChars = true,
  hideLegalCurrency = true,
  needShowEquelFlag = false,
  spaceAfterChar = true,
}: any) => {
  const currency = useCurrencyStore(s => s.currency);
  const rate = useCurrencyStore(s => coin ? s.prices[coin] || '' : '');
  const precision = useCategoriesStore(s => (s.coinDict[baseCurrency] || DEFAULT_PRECESION).precision);
  const { currentLang } = useLang();

  if (!rate || value === null) {
    return <span>{defaultValue}</span>;
  }

  try {
    const selected = CURRENCY_CHARS.filter((item) => item.currency === currency)[0];
    const space = spaceAfterChar ? ' ' : '';
    const legalChars = useLegalChars ? (selected ? `${selected.char}${space}` : '') : '';

    let target = multiplyFloor(rate, value, Number(precision || 2));

    if (+value === 0 || +target !== 0) {
      if (Number(target) >= 1) {
        target = formatLocalLangNumber({
          data: target,
          lang: currentLang,
          interceptDigits: 2,
        });
      } else if (Number(target) < 1) {
        target = precision
          ? formatLocalLangNumber({
              data: target,
              lang: currentLang,
              interceptDigits: precision,
            })
          : target;
      }
      target = `${legalChars}${target}`;
      target = showType === 1 ? `${needShowEquelFlag ? '≈ ' : ''}${target}` : target;
    } else {
      target = `< ${legalChars}0.${'0'.repeat(Number((precision || 2)) - 1)}1`;
    }

    return (
      <span className={className}>
        <span className={amountClassName} data-role="num">
          {/* 增加unicode字符让其在rtl下货币符号不翻转 */}
          &#x200E;{target}
        </span>
        {!hideLegalCurrency && <span className={currencyClassName}>{currency}</span>}
      </span>
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default CoinCurrency;
