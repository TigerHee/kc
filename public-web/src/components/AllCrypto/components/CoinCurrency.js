/**
 * Owner: kevyn.yu@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { CURRENCY_CHARS } from 'config/base';
import { formatLocalLangNumber } from 'helper';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import keysEquality from 'tools/keysEquality';
import multiplyFloor from 'utils/multiplyFloor';

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
}) => {
  const { currency, prices } = useSelector(
    (state) => state.currency,
    keysEquality[('currency', 'prices')],
  );
  const { precision } = useSelector((state) => state.categories[baseCurrency] || {}, shallowEqual);
  const { currentLang } = useLocale();
  const rate = prices[coin];

  if (!rate || value === null) {
    return <span>{defaultValue}</span>;
  }

  const selected = CURRENCY_CHARS.filter((item) => item.currency === currency)[0];
  const space = spaceAfterChar ? ' ' : '';
  const legalChars = useLegalChars ? (selected ? `${selected.char}${space}` : '') : '';

  let target = multiplyFloor(rate, value, precision || 2);
  if (+value === 0 || +target !== 0) {
    if (target >= 1) {
      target = formatLocalLangNumber({
        data: target,
        lang: currentLang,
        interceptDigits: 2,
      });
    } else if (target < 1) {
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
    target = `< ${legalChars}0.${'0'.repeat((precision || 2) - 1)}1`;
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
};

export default CoinCurrency;
