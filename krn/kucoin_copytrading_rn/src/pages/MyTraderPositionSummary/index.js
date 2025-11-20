import {usePullSummaryQuery} from 'pages/TraderProfile/hooks/usePullSummaryQuery';
import React, {memo, useMemo, useState} from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';

import Alert from 'components/Common/Alert';
import Header from 'components/Common/Header';
import CurrentPositionInfo from 'components/copyTradeComponents/PositionInfoComponents/CurrentPositionInfo';
import HistoryPositionInfo from 'components/copyTradeComponents/PositionInfoComponents/HistoryPositionInfo';
import {UserAvatar} from 'components/copyTradeComponents/UserInfo';
import FlatList from 'components/FlatList';
import {LEAD_CONFIG_STATUS} from 'constants/businessType';
import useGoBack from 'hooks/useGoBack';
import useLang from 'hooks/useLang';
import {useParams} from 'hooks/useParams';
import {useExpose} from './hooks/useExpose';
import {usePullTraderAndProfitQuery} from './hooks/usePullTraderAndProfitQuery';
import {MATCH_URL_PARAMS, RANGE_LIST_TYPE} from './constant';
import ProfitHeader from './ProfitHeader';
import {
  HeaderTitleWrap,
  TargetUserName,
  TraderPositionSummaryPage,
} from './styles';
import TimeRangeTabs from './TimeRangeTabs';

const PositionItem = memo(
  ({info, isActiveCurrentTab, toggleHighFrequencyPolling}) => {
    if (isActiveCurrentTab) {
      return (
        <CurrentPositionInfo
          info={info}
          positionActionCallback={toggleHighFrequencyPolling}
        />
      );
    }

    return <HistoryPositionInfo info={info} />;
  },
);

const MyTraderPositionSummary = () => {
  const goBack = useGoBack();
  const {isHistoryCopyTrader: paramIsHistoryCopyTrader} = useParams();
  const isHistoryCopyTrader = paramIsHistoryCopyTrader === MATCH_URL_PARAMS;
  const {
    data: profitResp,
    isLoading,
    toggleHighFrequencyPolling,
  } = usePullTraderAndProfitQuery();
  // 历史交易员无 '当前仓位 tab'
  const [rangeValue, setRangeValue] = useState(
    isHistoryCopyTrader ? RANGE_LIST_TYPE.history : RANGE_LIST_TYPE.current,
  );
  const isActiveCurrentTab = useMemo(
    () => rangeValue === RANGE_LIST_TYPE.current,
    [rangeValue],
  );

  useExpose({rangeValue});

  const {activePositions, hisPositions, copying} = profitResp?.data || {};
  const {data: summaryResp, isFetching: isLeadSummaryLoading} =
    usePullSummaryQuery();
  const {avatar, nickName, status, leadStatus} = summaryResp?.data || {};
  const {_t} = useLang();
  const isLeadUnNormal = leadStatus !== LEAD_CONFIG_STATUS.NORMAL;

  return (
    <>
      <Header
        title={
          <HeaderTitleWrap>
            <View
              style={css`
                margin-right: 8px;
              `}>
              <UserAvatar
                userInfo={{
                  avatarUrl: avatar,
                  nickName,
                }}
              />
            </View>
            <TargetUserName numberOfLines={1} ellipsizeMode={'tail'}>
              {nickName}
            </TargetUserName>
          </HeaderTitleWrap>
        }
        onPressBack={goBack}
      />
      <TraderPositionSummaryPage>
        {!isLeadSummaryLoading && isLeadUnNormal && (
          <Alert
            style={css`
              margin: 8px 0;
            `}
            message={_t('01c474cee1354000a03d')}
          />
        )}

        <TimeRangeTabs
          isHistoryCopyTrader={isHistoryCopyTrader}
          tabValue={rangeValue}
          setTabValue={setRangeValue}
        />
        <FlatList
          loading={isLoading}
          initialNumToRender={5}
          scrollEventThrottle={200}
          showsVerticalScrollIndicator={false}
          data={isActiveCurrentTab ? activePositions : hisPositions}
          keyExtractor={(_item, index) => `${index}`}
          renderItem={({item}) => (
            <PositionItem
              info={item}
              toggleHighFrequencyPolling={toggleHighFrequencyPolling}
              isActiveCurrentTab={isActiveCurrentTab}
            />
          )}
          ListHeaderComponent={
            <ProfitHeader
              isLeadSummaryLoading={isLeadSummaryLoading}
              isLeadUnNormal={isLeadUnNormal}
              status={status}
              isCopying={copying}
              isHistoryCopyTrader={isHistoryCopyTrader}
              isActiveCurrentTab={isActiveCurrentTab}
            />
          }
        />
      </TraderPositionSummaryPage>
    </>
  );
};

export default memo(MyTraderPositionSummary);
