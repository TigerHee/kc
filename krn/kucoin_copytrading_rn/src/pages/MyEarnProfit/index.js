import {useMemoizedFn} from 'ahooks';
import React, {useState} from 'react';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import CustomFlatList from 'components/Common/CustomFlatList';
import Header from 'components/Common/Header';
import useLang from 'hooks/useLang';
import {useParams} from 'hooks/useParams';
import useTracker from 'hooks/useTracker';
import {isAndroid} from 'utils/helper';
import {useDataSource} from './hooks/useDataSource';
import {useSharingProfitQuery} from './hooks/useSharingProfitQuery';
import ProfitContent from './ProfitHeader/ProfitContent';
import TradeListSwitchTab from './ProfitHeader/TradeListSwitchTab';
import {MY_EARN_LIST_TYPE} from './constant';
import MyFollowerItem from './MyFollowerItem';
import {MyEarnPage} from './styles';

const MyEarnProfit = () => {
  const {_t} = useLang();
  const {isUnProfitShare} = useParams();
  const [tabValue, setTabValue] = useState(() =>
    `${isUnProfitShare}` === 'true'
      ? MY_EARN_LIST_TYPE.estimatedPending
      : MY_EARN_LIST_TYPE.historySharing,
  );

  const {onClickTrack} = useTracker();
  const {colorV2} = useTheme();

  const isShowCumulativeProfit = tabValue === MY_EARN_LIST_TYPE.historySharing;

  const {dataSource, myCopyFollowersCount, isLoading, onEndReached} =
    useDataSource({
      isShowCumulativeProfit,
    });

  const {data: profitResp} = useSharingProfitQuery();
  const {cumulativeProfitSharing, unrealizedProfitSharing, profitSharingRatio} =
    profitResp?.data || {};

  const handleTabChange = useMemoizedFn(val => {
    onClickTrack({
      blockId: 'tab',
      locationId:
        val === MY_EARN_LIST_TYPE.estimatedPending
          ? 'profitShare'
          : 'profitShareHistory',
    });

    setTabValue(val);
  });
  return (
    <>
      <Header
        title={_t('c85114dda01b4000aa5a')}
        style={css`
          background-color: ${colorV2.overlay};
        `}
        contentStyle={css`
          background-color: ${colorV2.overlay};
        `}
      />

      <MyEarnPage>
        <CustomFlatList
          style={css`
            padding-left: 16px;
            padding-right: 16px;
            padding-bottom: ${isAndroid ? '16px' : 0};
          `}
          StickyElementComponent={
            <TradeListSwitchTab
              myCopyFollowersCount={myCopyFollowersCount}
              tabValue={tabValue}
              setTabValue={handleTabChange}
            />
          }
          HeaderComponent={
            <ProfitContent
              cumulativeProfitSharing={cumulativeProfitSharing}
              unrealizedProfitSharing={unrealizedProfitSharing}
              profitSharingRatio={profitSharingRatio}
            />
          }
          keyExtractor={(item, idx) => `${tabValue}_${item?.uid}_${idx}`}
          onEndReached={onEndReached}
          loading={isLoading}
          data={dataSource}
          renderItem={({item}) => (
            <MyFollowerItem
              isShowCumulativeProfit={isShowCumulativeProfit}
              data={item}
            />
          )}
        />
      </MyEarnPage>
    </>
  );
};

export default MyEarnProfit;
