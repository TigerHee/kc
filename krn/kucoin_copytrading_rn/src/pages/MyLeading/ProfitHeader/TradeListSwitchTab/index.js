import React, {memo, useMemo} from 'react';
import {View} from 'react-native';
import {Tabs} from '@krn/ui';

import useLang from 'hooks/useLang';
import {
  makeMyLeadTabList,
  makeRangeTabList,
  MY_LEADING_LIST_TYPE,
} from '../../constant';
import {useMyLeadingSwitchHelper} from '../../hooks/useMyLeadingSwitchHelper';
import FollowerTopBar from './FollowerTopBar';
import {SecondaryFilterBarWrap, SecondaryTabText} from './styles';

const {Tab} = Tabs;

const TradeListSwitchTab = ({myCopyFollowersCount}) => {
  const {handleTabChange, handleRangeChange, rangeValue, tabValue} =
    useMyLeadingSwitchHelper();
  const isPositionTab = MY_LEADING_LIST_TYPE.myPosition === tabValue;
  const isFollowerTab = MY_LEADING_LIST_TYPE.myFollower === tabValue;
  const {_t} = useLang();
  const myLeadTabList = useMemo(() => makeMyLeadTabList({_t}), [_t]);

  const rangList = useMemo(() => makeRangeTabList({_t}), [_t]);
  return useMemo(
    () => (
      <View>
        <Tabs value={tabValue} onChange={handleTabChange}>
          {myLeadTabList.map(i => (
            <Tab key={i.itemKey} label={i.label} value={i.itemKey} />
          ))}
        </Tabs>

        {isPositionTab && (
          <SecondaryFilterBarWrap>
            <Tabs
              variant="border"
              value={rangeValue}
              onChange={handleRangeChange}>
              {rangList.map(i => (
                <Tab
                  key={i.itemKey}
                  label={
                    <SecondaryTabText active={rangeValue === i.itemKey}>
                      {i.label}
                    </SecondaryTabText>
                  }
                  value={i.itemKey}
                />
              ))}
            </Tabs>
          </SecondaryFilterBarWrap>
        )}

        {isFollowerTab && (
          <FollowerTopBar myCopyFollowersCount={myCopyFollowersCount} />
        )}
      </View>
    ),
    [
      tabValue,
      handleTabChange,
      myLeadTabList,
      isPositionTab,
      rangeValue,
      handleRangeChange,
      rangList,
      isFollowerTab,
      myCopyFollowersCount,
    ],
  );
};

export default memo(TradeListSwitchTab);
