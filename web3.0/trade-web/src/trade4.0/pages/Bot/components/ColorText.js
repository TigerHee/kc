/**
 * Owner: mike@kupotech.com
 */
import { styled } from '@kux/mui/emotion';
import {
  RateToNumber,
  formatEffectiveDecimal,
  formatNumber,
  isNull,
  dividerNumberParts,
  floatToPercent,
} from 'Bot/helper';
import React, { Children } from 'react';
import { isRTLLanguage } from 'utils/langTools';
import { Text } from './Widgets';

const getNumberUnit = (num) => {
  num = Number(num);
  if (num > 0) {
    return '+';
  } else if (num < 0) {
    return '-';
  }
  return '';
};

const dropNumberUnit = (num) => {
  return String(num).replace(/[+-]/, '');
};

const getTextType = (val) => {
  val = Number(val);
  if (val > 0) {
    return 'primary';
  } else if (val < 0) {
    return 'secondary';
  }
  return 'text60';
};
// 涨跌幅带有正负号
/**
 * @description:
 * @param {*} value
 * @param {*} precision 精度
 * @param {*} isShowEffectiveDecimal 是否显示有效的小数位
 * @param {*} color 颜色类型
 * @param {*} hasUnit 是否添加正号
 * @param {array} rest
 * @return {*}
 */
export const ChangeRate = ({
  empty = '--',
  value,
  precision = 2,
  isShowEffectiveDecimal = false,
  color,
  hasUnit = true,
  prefix = '',
  suffix = '',
  className,
  ...rest
}) => {
  const isEmpty = isNull(value) || isNaN(value);
  if (isEmpty) {
    return (
      <Text color="text60" {...rest}>
        {empty}
      </Text>
    );
  }
  return (
    <Text color={color || getTextType(value)} className={`notDir bot-changeRate ${className}`} {...rest}>
      {prefix}
      {floatToPercent(value, 2, null, hasUnit)}
      {suffix}
    </Text>
  );
};
// 展示价格
export const Price = ({ value, changeRate, precision, children, className, ...rest }) => {
  if (!value) {
    return (
      <Text color="text60" className={`bot-price ${className}`} {...rest}>
        --
      </Text>
    );
  }
  changeRate = RateToNumber(changeRate);
  return (
    <Text
      color={getTextType(changeRate)}
      className={`${children ? 'flex vc' : ''} ${className} bot-price notDir`}
      {...rest}
    >
      {formatNumber(value, precision)}
      {children}
    </Text>
  );
};

// 展示盈利
export const Profit = ({ value, precision, empty = '', unit, ...rest }) => {
  const isEmpty = isNull(value) || isNaN(value);
  if (isEmpty) {
    return (
      <Text color="text60" {...rest}>
        {empty}
      </Text>
    );
  }
  value = Number(formatEffectiveDecimal(value, precision, false));
  return (
    <Text color={getTextType(value)} {...rest} className="notDir">
      {getNumberUnit(value)}
      {dropNumberUnit(formatEffectiveDecimal(value, precision))}
    </Text>
  );
};
/**
 * @description: 格式化数据
 * @param {boolean} effective 是否一直取小树位到 最大12 位
 * @return {*}
 */
export const FormatNumber = ({ value, empty = '--', precision, effective = false }) => {
  if (value) {
    if (effective) {
      return formatEffectiveDecimal(value, precision);
    }
    return formatNumber(value, precision);
  }
  return empty;
};

/**
 * @description: 处理RTL语言数据 -9999.999% 翻转问题
 * @param {*} children
 * @return {JSX}
 */
export const UnicodeRTL = ({ children }) => {
  if (!isRTLLanguage()) {
    return children;
  }
  const results = dividerNumberParts(children);
  if (!Array.isArray(results)) {
    return children;
  }
  const unit = results[0];
  const percent = results[2];
  let num = results[1];
  // 没有符号 百分号 不处理
  if (!unit && !percent) {
    return children;
  }
  // 数据部分不翻转 强制从左到右
  num = <>&#x202D;{num}&#x202C;</>;
  return (
    <>
      &#x202E;
      {unit}
      {num}
      {percent}
      &#x202C;
    </>
  );
};
