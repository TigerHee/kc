import React from 'react';
import {getBaseCurrency} from 'site/tenant';

import {RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import {BarText, BarWrap, Gap} from './styles';

const FollowerTopBar = ({myCopyFollowersCount}) => {
  const {_t} = useLang();

  return (
    <BarWrap>
      <RowWrap>
        <BarText>
          {_t('80866cd0a0604000ac44', {num: myCopyFollowersCount || '-'})}
        </BarText>
        <Gap />
      </RowWrap>

      <BarText>
        {_t('82091c5047174000a4ac', {symbol: getBaseCurrency()})}
      </BarText>
    </BarWrap>
  );
};

export default FollowerTopBar;
