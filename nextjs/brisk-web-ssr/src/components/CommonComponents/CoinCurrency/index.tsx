import { currencyArray } from 'gbiz-next/metadata';
import { getCurrentLang } from 'kc-next/i18n';
import multiplyFloor from '@/tools/multiplyFloor';
import { useCurrencyStore } from '@/store/currency';
import { useCategoriesStore } from '@/store/categories';
import formatLocalLangNumber from '@/tools/formatLocalLangNumber';

interface CoinCurrencyProps {
  baseCurrency: string;
  coin: string;
  value: number | null;
  showType?: number;
  defaultValue?: string;
  className?: string;
  amountClassName?: string;
  currencyClassName?: string;
  useLegalChars?: boolean;
  hideLegalCurrency?: boolean;
  needShowEquelFlag?: boolean;
  spaceAfterChar?: boolean;
}

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
}: CoinCurrencyProps) => {
  const currentLang = getCurrentLang();
  const { categories } = useCategoriesStore();
  const { prices, currency } = useCurrencyStore();

  const precision = categories?.[baseCurrency]?.precision || 2;
  const rate = prices[coin];

  if (!rate || value === null) {
    return <span className={className}>{defaultValue}</span>;
  }

  const selected = currencyArray.filter(item => item.currency === currency)[0];
  const space = spaceAfterChar ? ' ' : '';
  const legalChars = useLegalChars ? (selected ? `${selected.char}${space}` : '') : '';

  let target = multiplyFloor(rate, value, precision);
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
            options: { maximumFractionDigits: precision },
          })
        : target;
    }
    target = `${legalChars}${target}`;
    target = showType === 1 ? `${needShowEquelFlag ? '≈ ' : ''}${target}` : target;
  } else {
    target = `< ${legalChars}0.${'0'.repeat(precision - 1)}1`;
  }

  return (
    <span className={className || ''}>
      <span className={amountClassName || ''} data-role="num">
        {/* 增加unicode字符让其在rtl下货币符号不翻转 */}
        &#x200E;{target}
      </span>
      {!hideLegalCurrency && <span className={currencyClassName || ''}>{currency}</span>}
    </span>
  );
};

export default CoinCurrency;
