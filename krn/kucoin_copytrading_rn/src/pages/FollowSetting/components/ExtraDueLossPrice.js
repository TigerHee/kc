import React from 'react';

import {useCalcDueLossPrice} from '../hooks/useCalcDueLossPrice';
import {DueLossPrice, ExtraLabelText} from '../styles';

export const ExtraDueLossPrice = ({control}) => {
  const dueLossPrice = useCalcDueLossPrice({control});

  return (
    <ExtraLabelText>
      预计亏损:{' '}
      {dueLossPrice ? <DueLossPrice>{dueLossPrice}</DueLossPrice> : '--'} USDT
    </ExtraLabelText>
  );
};
