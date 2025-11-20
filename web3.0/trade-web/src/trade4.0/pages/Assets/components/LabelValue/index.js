/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useMemo } from 'react';
import { LabelValueWrapper, Label, Value } from '../../style';
import { useSelector } from 'dva';
import { isUndef } from 'helper';
import { formatNumber } from '@/utils/format';
import Tooltip from '@mui/Tooltip';
import Mask, { Placeholder } from 'src/trade4.0/components/Mask';

/**
 * 资产显示的数字
 */
export const AssetsValue = (props) => {
  const { value, formatValue = true, currency, ...restProps } = props;
  const showAssets = useSelector((state) => state.setting.showAssets);
  const isLogin = useSelector((state) => state.user.isLogin);

  const categories = useSelector((state) => state.categories);
  const { precision } = categories[currency] || {};

  const val = useMemo(() => {
    if (!showAssets) return <Mask />;
    if (isUndef(value) || !isLogin) return <Placeholder />;
    return formatValue ? formatNumber(value, { fixed: precision }) : value;
  }, [value, showAssets]);

  return (
    <Value empty={isUndef(value)} {...restProps}>
      {val}
    </Value>
  );
};

/**
 * LabelValue
 * key - value 健值对
 * 可传 tooltip 和 自己自定义 value
 */
const LabelValue = (props) => {
  const {
    label,
    value,
    labelHighlight = false,
    tooltip,
    onlyRenderValue = false,
    formatValue,
    currency,
    valueProps,
    labelProps,
    ...restProps
  } = props;

  return (
    <LabelValueWrapper {...restProps}>
      {tooltip ? (
        <Tooltip title={tooltip}>
          <Label underline={!!tooltip} highlight={labelHighlight} {...labelProps}>
            {label}
          </Label>
        </Tooltip>
      ) : (
        <Label highlight={labelHighlight} {...labelProps}>
          {label}
        </Label>
      )}
      <AssetsValue value={value} formatValue={formatValue} currency={currency} {...valueProps} />
    </LabelValueWrapper>
  );
};

export default memo(LabelValue);
