import {useMemoizedFn} from 'ahooks';
import {useLaunchLeadOrder} from 'pages/MyLeading/hooks/useLaunchLeadOrder';
import React from 'react';
import styled from '@emotion/native';

import Button from 'components/Common/Button';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {ApplyTraderBanner} from './ApplyTraderBanner';

const StyledButton = styled(Button)`
  height: 40px;
`;

const ApplyTraderCard = ({isLeadTrader}) => {
  const {_t} = useLang();
  const {onClickTrack} = useTracker();
  const {launchLeadOrder} = useLaunchLeadOrder();

  const launchLeadOrderWithTrack = useMemoizedFn(() => {
    onClickTrack({
      blockId: 'head',
      locationId: 'leadTradeButton',
    });
    launchLeadOrder();
  });
  if (isLeadTrader) {
    return (
      <StyledButton onPress={launchLeadOrderWithTrack}>
        {_t('e112fe43b1194000a36a')}
      </StyledButton>
    );
  }

  return <ApplyTraderBanner />;
};

export default ApplyTraderCard;
