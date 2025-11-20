import React, {memo} from 'react';
import {css} from '@emotion/native';

import HorizontalScrollContainer from 'components/Common/HorizontalScrollContainer';
import useLang from 'hooks/useLang';
import {makeMyEarnTabList} from '../../constant';
import {EarnTipBanner} from './EarnTipBanner';
import FollowerTopBar from './FollowerTopBar';
import {StyledTab, StyledTabs, SwitchTabWrap} from './styles';

const TradeListSwitchTab = ({tabValue, setTabValue, myCopyFollowersCount}) => {
  const {_t} = useLang();

  const earnTabList = makeMyEarnTabList({_t});

  return (
    <SwitchTabWrap>
      <HorizontalScrollContainer
        style={css`
          padding: 0 16px;
        `}>
        <StyledTabs value={tabValue} onChange={setTabValue}>
          {earnTabList.map((i, idx) => (
            <StyledTab
              key={i.itemKey}
              isFirstElement={idx === 0}
              isEndElement={idx === earnTabList?.length - 1}
              label={i.label}
              value={i.itemKey}
            />
          ))}
        </StyledTabs>
      </HorizontalScrollContainer>
      <EarnTipBanner tabValue={tabValue} />
      <FollowerTopBar myCopyFollowersCount={myCopyFollowersCount} />
    </SwitchTabWrap>
  );
};

export default memo(TradeListSwitchTab);
