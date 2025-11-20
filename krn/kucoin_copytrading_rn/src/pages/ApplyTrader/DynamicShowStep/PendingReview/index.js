import React from 'react';
import {css} from '@emotion/native';

import ApplyTraderWithTopBgWrap from '../../components/ApplyTraderWithTopBgWrap';
import PrivilegeDesc from '../../components/PrivilegeDesc';
import {ApplyTraderCommonScrollWrap} from '../styles';

const PendingReview = () => {
  return (
    <ApplyTraderCommonScrollWrap>
      <ApplyTraderWithTopBgWrap>
        <PrivilegeDesc
          style={css`
            padding: 0 16px;
          `}
        />
      </ApplyTraderWithTopBgWrap>
    </ApplyTraderCommonScrollWrap>
  );
};

export default PendingReview;
