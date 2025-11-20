import {useMemoizedFn} from 'ahooks';
import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {getBaseCurrency} from 'site/tenant';
import {useTheme} from '@krn/ui';

import {HomeFilterSearchIc} from 'components/Common/SvgIcon';
import TipTrigger from 'components/Common/TipTrigger';
import {Title} from 'components/Common/Title';
import {mediumHitSlop} from 'constants/index';
import {RouterNameMap} from 'constants/router-name-map';
import {RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import {usePush} from 'hooks/usePush';
import FilterCondition from './TraderInfoListFilterBar/FilterCondition';
import ActivityBar from './ActivityBar';
import {
  HomeContentWrapper,
  makeTitleTextStyle,
  MarketBoardTitleBar,
} from './styles';

const ContentListHeader = props => {
  const {children, topArea, updateFormState, formState} = props;
  const {_t} = useLang();
  const colors = useTheme();
  const {push} = usePush();
  const gotoSearch = useMemoizedFn(() => push(RouterNameMap.TraderSearch));

  return (
    <View>
      {topArea}
      <HomeContentWrapper>
        <ActivityBar />
        <MarketBoardTitleBar>
          <Title
            title={
              <TipTrigger
                textStyle={makeTitleTextStyle(colors)}
                text={_t('0ce396a3c1b94000a896')}
                title={_t('0ce396a3c1b94000a896')}
                message={_t('0f5edf5c57504000a41f', {
                  symbol: getBaseCurrency(),
                })}
              />
            }
            rightNode={
              <RowWrap>
                <TouchableOpacity
                  hitSlop={mediumHitSlop}
                  activeOpacity={0.8}
                  onPress={gotoSearch}>
                  <HomeFilterSearchIc />
                </TouchableOpacity>

                <FilterCondition
                  value={formState.criteria}
                  onChange={value =>
                    updateFormState({
                      criteria: value,
                    })
                  }
                />
              </RowWrap>
            }
          />
        </MarketBoardTitleBar>
        {children}
      </HomeContentWrapper>
    </View>
  );
};

export default memo(ContentListHeader);
