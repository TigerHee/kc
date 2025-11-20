import React from 'react';
import {getBaseCurrency} from 'site/tenant';

import useLang from 'hooks/useLang';
import {BarText, BarWrap} from './styles';

const ListTopBar = () => {
  const {_t} = useLang();
  return (
    <BarWrap>
      <BarText>{_t('a80a5aab7e0b4000a608')}</BarText>
      <BarText>
        {_t('8b1e278175f64000ae98', {symbol: getBaseCurrency()})}
      </BarText>
    </BarWrap>
  );
};

export default ListTopBar;
