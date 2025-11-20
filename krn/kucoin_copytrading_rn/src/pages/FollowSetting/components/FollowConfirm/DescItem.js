import React, {memo} from 'react';

import {DescItemWrap, DescLabel, DescValue} from './styles';

const DescItem = ({item, confirmDetail}) => {
  const {label, render, key, needBottomBorder} = item || {};
  return (
    <DescItemWrap key={key} needBottomBorder={needBottomBorder}>
      <DescLabel>{label}</DescLabel>
      <DescValue>{!render ? '-' : render?.(confirmDetail[key])}</DescValue>
    </DescItemWrap>
  );
};

export default memo(DescItem);
