import React, {memo} from 'react';
import {View} from 'react-native';

import HorizontalScrollContainer from 'components/Common/HorizontalScrollContainer';
import {TraderInfoCard} from 'components/copyTradeComponents/TraderInfoComponents';
import {styles} from './styles';

const HOT_CARD_GROUP_LIST = [
  {title: 'Highest Profit', tip: 'Highest Profit', renderKey: 'profit'},

  {title: 'Stable Invest', tip: 'Stable Invest', renderKey: 'stable'},

  {title: 'Most Popular', tip: 'Most Popular', renderKey: 'popular'},
];

const HopCardGroup = _props => {
  const listEntity = {
    profit: [1, 1, 1],
    stable: [1, 1],
    popular: [1, 2, 3, 4, 5],
  };

  return (
    <View style={styles.hotCardGroupWrap}>
      {HOT_CARD_GROUP_LIST.map(groupItem => {
        const {title, tip, renderKey} = groupItem;
        return (
          <View key={title}>
            <HorizontalScrollContainer style={styles.scrollWrap}>
              {listEntity[renderKey].map((item, index) => {
                return (
                  <TraderInfoCard
                    key={index}
                    style={styles.traderInfoCard}
                    hideFollowerProfitAndAssetSize
                  />
                );
              })}
            </HorizontalScrollContainer>
          </View>
        );
      })}
    </View>
  );
};

export default memo(HopCardGroup);
