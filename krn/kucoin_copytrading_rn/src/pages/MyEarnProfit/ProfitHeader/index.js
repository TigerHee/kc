import React, {memo} from 'react';
import {View} from 'react-native';

import ProfitContent from './ProfitContent';
import TradeListSwitchTab from './TradeListSwitchTab';

const ProfitHeader = () => {
  return (
    <View>
      <ProfitContent />
      <TradeListSwitchTab />
    </View>
  );
};

export default memo(ProfitHeader);
