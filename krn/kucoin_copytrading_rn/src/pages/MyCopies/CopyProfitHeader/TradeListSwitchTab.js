import React, {memo, useEffect} from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';
import {Tabs} from '@krn/ui';

import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {
  makeMyCopyTabList,
  makeRangeTabList,
  MY_COPY_LIST_TYPE,
  RANGE_LIST_TYPE,
} from '../constant';
import {useMyCopiesSwitchHelper} from '../hooks/useMyCopiesSwitchHelper';
import {TraderFilterBar} from './components/TraderFilterBar';
import {FillHeight, SecondaryFilterBarWrap, SecondaryTabText} from './styles';

const {Tab} = Tabs;

const sa = {
  [MY_COPY_LIST_TYPE.myAttention]: {
    blockId: 'myFollow',
    locationId: 'myFollowTab',
  },
  [MY_COPY_LIST_TYPE.myTrader]: {
    blockId: 'myTrader',
    locationId: 'myTraderTab',
  },
  [MY_COPY_LIST_TYPE.myPosition]: {
    blockId: 'myPosition',
    locationId: 'myPositionTab',
  },
};
const subSA = {
  [RANGE_LIST_TYPE.current]: 'currentTab',
  [RANGE_LIST_TYPE.history]: 'historyTab',
};

const TradeListSwitchTab = () => {
  const {handleTabChange, handleRangeChange, rangeValue, tabValue} =
    useMyCopiesSwitchHelper();
  const {_t} = useLang();
  const {onClickTrackInMainMyCopyPage} = useTracker();

  const copyTabList = makeMyCopyTabList({_t});

  const rangTabList = makeRangeTabList({_t});
  const isShowRangeTab = [
    MY_COPY_LIST_TYPE.myPosition,
    MY_COPY_LIST_TYPE.myTrader,
  ].includes(tabValue);

  useEffect(() => {
    onClickTrackInMainMyCopyPage(sa[tabValue]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue]);

  useEffect(() => {
    isShowRangeTab &&
      onClickTrackInMainMyCopyPage({
        blockId: sa[tabValue].blockId,
        locationId: subSA[rangeValue],
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue, rangeValue, isShowRangeTab]);

  return (
    <View>
      <Tabs value={tabValue} onChange={handleTabChange}>
        {copyTabList.map((i, idx) => (
          <Tab key={i.itemKey || idx} label={i.label} value={i.itemKey} />
        ))}
      </Tabs>

      {isShowRangeTab ? (
        <SecondaryFilterBarWrap>
          <Tabs
            style={css`
              flex: 1;
            `}
            variant="border"
            value={rangeValue}
            onChange={handleRangeChange}>
            {rangTabList.map((i, idx) => (
              <Tab
                key={i.itemKey || idx}
                label={
                  <SecondaryTabText active={rangeValue === i.itemKey}>
                    {i.label}
                  </SecondaryTabText>
                }
                value={i.itemKey}
              />
            ))}
          </Tabs>
          <TraderFilterBar rangeValue={rangeValue} tabValue={tabValue} />
        </SecondaryFilterBarWrap>
      ) : (
        <FillHeight />
      )}
    </View>
  );
};

export default memo(TradeListSwitchTab);
