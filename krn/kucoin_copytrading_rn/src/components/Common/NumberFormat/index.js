import React, {memo, useMemo} from 'react';
import {Text} from 'react-native';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import {useGetUSDTCurrencyInfo} from 'hooks/useGetUSDTCurrencyInfo';
import {isUnfOrZero} from 'utils/helper';
import {useGetFormatNumber} from './useFormatNumber';

//isProfitNumber 为跟单收益相关数值展示，规则： 1.保留两位小数 2.正数展示“+”号
const NumberFormat = props => {
  const {
    placeholder = '--',
    options,
    isProfitNumber = false, // 收益相关金额类型规则： 1.保留两位小数 2.正数展示“+”号
    isAumNumber = false, // 投入资金相关金额类型规则： 1.保留两位小数 2.正数不展示“+”
    isPositive,
    children,
    style,
    beforeText = '',
    afterText = '',
  } = props;
  const {colorV2} = useTheme();
  const formatNumberFn = useGetFormatNumber();
  const {displayPrecision} = useGetUSDTCurrencyInfo();

  const isProfitAndAumNumber = isProfitNumber || isAumNumber;

  const enhanceOptions = useMemo(() => {
    const profitNumberOption = {
      minimumFractionDigits: 2,
      maximumFractionDigits: displayPrecision,
    };

    const mergeOptions = {
      ...(isProfitAndAumNumber ? profitNumberOption : {}),
      ...(options || {}),
    };
    if (mergeOptions.minimumFractionDigits) {
      mergeOptions.minimumFractionDigits = +mergeOptions.minimumFractionDigits;
    }

    if (mergeOptions.maximumFractionDigits) {
      mergeOptions.maximumFractionDigits = +mergeOptions.maximumFractionDigits;
    }

    return mergeOptions;
  }, [displayPrecision, isProfitAndAumNumber, options]);

  const formatNumberValue = useMemo(
    () =>
      formatNumberFn(children, {
        isProfitNumber,
        placeholder,
        isPositive,
        beforeText,
        afterText,
        options: enhanceOptions,
      }),
    [
      afterText,
      beforeText,
      children,
      enhanceOptions,
      formatNumberFn,
      isPositive,
      isProfitNumber,
      placeholder,
    ],
  );

  const isUnfZero = isUnfOrZero(formatNumberValue);

  return (
    <Text
      style={[
        style,
        isUnfZero &&
          css`
            color: ${colorV2.text};
          `,
      ]}>
      {formatNumberValue}
    </Text>
  );
};

export default memo(NumberFormat);
