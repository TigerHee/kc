/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo } from 'react';
import { RiskValueWrapper } from '../../style';
import { AssetsValue } from '../LabelValue';
import DebtRatio from '../DebtRatio';

/**
 * RiskValue
 * 资产和风险模块
 */
const RiskValue = (props) => {
  const {
    value,
    percent,
    status,
    onlyRenderValue = false,
    ...restProps
  } = props;
  return (
    <RiskValueWrapper {...restProps}>
      {onlyRenderValue ? value : <AssetsValue value={value} />}
      <DebtRatio percent={percent} status={status} />
    </RiskValueWrapper>
  );
};

export default memo(RiskValue);
