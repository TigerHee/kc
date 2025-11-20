/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { NumberFormat } from '@kux/mui';
import { CURRENCY_CHARS } from 'config/base';
import { multiplyFloor } from 'helper';
import { isNil } from 'lodash';
import { useSelector } from 'src/hooks/useSelector';

/**
 * @description: 将一种【币种】转换成用户选择的单位计价
 * @return {*}
 */
const CoinTransfer = ({
  baseCurrency, // base 用于取精度, 不传默认2，如合约
  quoteCurrency, // quota 转换成对应币种的比例
  value,
  defaultValue = '--',
  showPrefixUnit = true, // 数字前面的法币符号
  showAppendUnit = true, //  数字后面的计价单位
  showEquelFlag = false, //  是否显示 约等于符号
  className,
  amountClassName,
  currencyClassName,
  isBlack,
  defaultPrecision,
}) => {
  const { currentLang } = useLocale();
  const currency = useSelector((state) => state.currency.currency); // 当前用户选择的法币单位
  const prices = useSelector((state) => state.currency.prices); // 转换比例
  const { precision } = useSelector((state) => state.categories[baseCurrency] || {}); // base 精度
  const rate = prices[quoteCurrency]; // 转换比例
  // 检查是否有效、0 展示--
  value = +value ? value : null;
  if (!rate || value === null) {
    return <span>{defaultValue}</span>;
  }

  // 对应金融符号
  const selected = CURRENCY_CHARS.filter((item) => item.currency === currency)[0];
  const legalChars = showPrefixUnit ? (selected ? `${selected.char}` : '') : '';

  let _precision = isNil(defaultPrecision) ? precision || 2 : defaultPrecision;
  let target = multiplyFloor(rate, value, _precision);
  let char; // ≈ ｜ < 符号
  // 转换后的数字超出精度显示0，但原本有值，显示 < 精度 (+value !== 0 && +target === 0)
  if (+value === 0 || +target !== 0) {
    if (target >= 1) {
      _precision = 2;
    }
    char = showEquelFlag ? '≈ ' : '';
  } else {
    target = `0.${'0'.repeat((precision || 2) - 1)}1`;
    char = '< ';
  }
  return (
    <span className={className}>
      <span className={`${amountClassName} ${isBlack ? 'isBlack' : ''}`} data-role="num">
        {char}
        <NumberFormat
          lang={currentLang}
          currency={legalChars}
          options={{
            // minimumFractionDigits: decimal,
            maximumFractionDigits: _precision,
          }}
        >
          {target}
        </NumberFormat>
      </span>
      {/* 目前没有用到 */}
      {!showAppendUnit && <span className={currencyClassName}>{currency}</span>}
    </span>
  );
};

export default CoinTransfer;
