/*
 * @Owner: elliott.su@kupotech.com
 */

/**
 * 此逻辑详见PRD：https://k-devdoc.atlassian.net/wiki/spaces/PTCPB/pages/655263577/PRD+Meme+-+-?focusedCommentId=673745056
 * 大于 1 的情况：
 *   先分离整数和小数部分。
 *   如果整数部分超过 6 位，直接对价格取整。
 *   小数部分最多保留 5 位，同时确保总位数不超过 6 位，小数末尾的 0 会被舍弃。
 * 小于 1 的情况：
 *   使用指数表示法提取前导 0 的数量。
 *   保留有效小数 5 位，压缩连续 0 的部分，并标记 {} 中的 0 数量。
 *   末尾的无效 0 会被去掉。
 */
import { FC } from 'react';
import { useTranslation } from 'tools/i18n';
import { numberFixed } from '../../common/tools';

interface PriceFormatterProps {
  price: number;
  locales: string | string[];
  currency: string;
}

interface CoinTransferFoldProps {
  value: number;
  defaultValue?: string;
}

// 获取当前语言环境的小数分隔符
const getDecimalSeparator = (locales: Intl.LocalesArgument) => {
  return (1.1).toLocaleString(locales).substring(1, 2);
};

const formatPrice = (price: number, locales: string | string[], currency = '') => {
  if (price >= 1) {
    const [integerPart, decimalPart] = price.toString().split('.');
    if (integerPart.length > 6) {
      // 超过 6 位直接取整
      const formatter = new Intl.NumberFormat(locales, {
        maximumFractionDigits: 0, // 不保留小数部分
      });
      return `${currency}${formatter.format(Math.round(price))}`;
    }

    // 格式化整数部分
    const formatter = new Intl.NumberFormat(locales, {
      maximumFractionDigits: 0, // 不保留小数部分
    });
    const formattedInteger = formatter.format(price);

    if (decimalPart) {
      // 计算小数点后的有效位数
      const maxDecimalLength = Math.min(5, 6 - integerPart.length);
      const formattedDecimal = decimalPart.slice(0, maxDecimalLength).replace(/0+$/, ''); // 去掉末尾的 0
      return formattedDecimal
        ? `${currency}${formatter.format(+integerPart)}${getDecimalSeparator(locales)}${formattedDecimal}`
        : `${currency}${formattedInteger}`;
    }
    return `${currency}${formattedInteger}`;
  }
  if (price < 1) {
    // 提取小数部分并统计前导 0
    const formattedPrice = numberFixed(price, 40);
    const decimalPart = formattedPrice.split(/[,.]/)[1] || ''; // 提取小数部分
    const leadingZerosMatch = decimalPart.match(/^0+/);
    const leadingZerosCount = leadingZerosMatch ? leadingZerosMatch[0].length : 0;

    // 有效数字部分，保留 5 位有效数字
    const effectiveDigits = decimalPart.slice(leadingZerosCount, leadingZerosCount + 5).replace(/0+$/, '');
    const decimalSeparator = getDecimalSeparator(locales);

    return leadingZerosCount >= 4
      ? {
          base: `${currency}0${decimalSeparator}0`,
          subscript: leadingZerosCount,
          digits: effectiveDigits,
        }
      : {
          base: `${currency}0${decimalSeparator}${'0'.repeat(leadingZerosCount)}`,
          digits: effectiveDigits,
        };
  }
  return { base: `${currency}0` }; // 处理价格等于 0 的情况
};

const PriceFormatter: FC<PriceFormatterProps> = ({ price, locales, currency = '' }) => {
  const formatted = formatPrice(price, locales, currency);

  if (typeof formatted === 'string') {
    return <span>{formatted}</span>;
  }

  const { base, subscript, digits } = formatted;

  return (
    <span>
      {base}
      {subscript !== undefined && <span style={{ verticalAlign: 'sub', fontSize: '0.75em' }}>{subscript}</span>}
      {digits}
    </span>
  );
};

/**
 * @description: 将一种【币种】转换成用户选择的单位计价(适用折叠逻辑，web3专属逻辑)
 * @return {*}
 */
const CoinTransferFold: FC<CoinTransferFoldProps> = ({ value, defaultValue = '--' }) => {
  const {
    i18n: { language: currentLang },
  } = useTranslation('header');

  // 检查是否有效、0 展示--
  if (!value || !Number(value)) {
    return <span>{defaultValue}</span>;
  }

  const _lang = currentLang.replace('_', '-');
  return <PriceFormatter price={Number(value)} locales={_lang} currency={''} />;
};

export default CoinTransferFold;
