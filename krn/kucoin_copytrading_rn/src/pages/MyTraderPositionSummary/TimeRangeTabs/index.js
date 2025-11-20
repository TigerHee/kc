import React, {memo, useMemo} from 'react';
import {View} from 'react-native';

import useLang from 'hooks/useLang';
import {makeTraderPositionSummaryTabList} from '../constant';
import {StyledTab, StyledTabs} from './styles';

const TimeRangeTabs = props => {
  const {tabValue, setTabValue, isHistoryCopyTrader} = props;
  const {_t} = useLang();
  const tabList = useMemo(() => {
    const list = makeTraderPositionSummaryTabList({_t});

    return isHistoryCopyTrader ? list.slice(1, 2) : list;
  }, [_t, isHistoryCopyTrader]);

  return (
    <View style={{width: '100%'}}>
      <StyledTabs value={tabValue} onChange={setTabValue}>
        {tabList?.map((i, idx) => (
          <StyledTab
            key={i.itemKey || idx}
            isFirstElement={idx === 0}
            label={i.label}
            value={i.itemKey}
          />
        ))}
      </StyledTabs>
    </View>
  );
};

export default memo(TimeRangeTabs);
