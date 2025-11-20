import React, {memo, useMemo} from 'react';
import styled from '@emotion/native';

import {TraderInfoCard} from 'components/copyTradeComponents/TraderInfoComponents';

const StyledTraderInfoCard = styled(TraderInfoCard)`
  margin-bottom: 12px;
`;

const MyAttentionTraderInfoCard = ({info}) => {
  const formatInfo = useMemo(() => {
    const {
      thirtyDayProfitDetail = {},
      traderInfoResponse = {},
      ...others
    } = info || {};

    return {
      ...others,
      ...thirtyDayProfitDetail,
      ...traderInfoResponse,
    };
  }, [info]);

  return <StyledTraderInfoCard info={formatInfo} pageId="B20CopyTradeMyCopy" />;
};

export default memo(MyAttentionTraderInfoCard);
