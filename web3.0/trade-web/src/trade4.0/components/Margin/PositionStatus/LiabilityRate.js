/*
  * owner: borden@kupotech.com
 */
import React from 'react';
import { isNil } from 'lodash';
import styled from '@emotion/styled';
import { _t, _tHTML } from 'src/utils/lang';
import { floadToPercent } from 'src/helper';
import useMarginModel from '@/hooks/useMarginModel';
import useMarginStatusConfig from '@/hooks/useMarginStatusConfig';

// 小于0.01处理
const renderSmallValue = (v) => {
  if (v === 0.00001) {
    return `<${floadToPercent(0.0001)}`;
  }
  return floadToPercent(v);
};

export const Container = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 130%;
  color: ${props => props.fontColor};
`;

const LiabilityRate = React.memo(({ symbol, status, liabilityRate, ...otherProps }) => {
  const { fontColor, type } = useMarginStatusConfig({ symbol, status, liabilityRate });
  const { liabilityRate: _liabilityRate } = useMarginModel(['liabilityRate'], { symbol });

  const value = liabilityRate === undefined ? _liabilityRate : liabilityRate;

  return (
    <Container fontColor={fontColor} {...otherProps}>
      {type === 'position' || isNil(value) && +value > 1
          ? '-%'
          : renderSmallValue(+value || 0)}
    </Container>
  );
});

export default LiabilityRate;
