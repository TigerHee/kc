import {useMemoizedFn} from 'ahooks';
import {usePullSummaryQuery} from 'pages/TraderProfile/hooks/usePullSummaryQuery';
import React, {memo} from 'react';
import {View} from 'react-native';
import {getBaseCurrency} from 'site/tenant';
import styled from '@emotion/native';
import {Button} from '@krn/ui';

import {Number, Percent} from 'components/Common/UpOrDownNumber';
import {TRADER_ACTIVE_STATUS} from 'constants/businessType';
import {commonStyles, RowWrap} from 'constants/styles';
import {useGotoFollowSetting} from 'hooks/copyTrade/useGotoFollowSetting';
import {useGotoProfit} from 'hooks/copyTrade/useGotoProfit';
import useLang from 'hooks/useLang';
import {useParams} from 'hooks/useParams';
import useTracker from 'hooks/useTracker';
import {usePullTraderAndProfitQuery} from './hooks/usePullTraderAndProfitQuery';

const CopyTradeProfitWrapper = styled.View`
  background-color: transparent;
  margin: 24px 0;
`;

const DescText = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 15.6px;
`;

const ProfitNumber = styled(Number)`
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
`;

const TinyProfit = styled(Number)`
  font-size: 14px;
  font-weight: 600;
  line-height: 18.2px;
  margin-left: 4px;
`;

const FirstProfitLineWrap = styled.View`
  ${commonStyles.flexRowCenter};
  ${commonStyles.justifyBetween};
  align-items: center;
`;

const TotalPnlWrap = styled(RowWrap)`
  margin-top: 4px;
  align-items: flex-end;
`;

const SecondProfitLineWrap = styled.View`
  ${commonStyles.flexRowCenter};
  ${commonStyles.justifyBetween};
  align-items: center;
  margin-top: 12px;
`;

const ShowPositionType = styled.Text`
  font-size: 14px;
  color: ${({theme}) => theme.colorV2.text40};
  font-weight: 400;
  line-height: 18.2px;
  margin-bottom: 8px;
`;

export const ProfitNumberPercent = styled(Percent)`
  font-size: 12px;
  font-weight: 600;
  line-height: 15.6px;
`;

const ProfitHeader = ({
  isActiveCurrentTab,
  isHistoryCopyTrader,
  isCopying,
  isLeadUnNormal,
  isLeadSummaryLoading,
  status,
}) => {
  const {data: summaryInfoResp} = usePullTraderAndProfitQuery();
  const {_t} = useLang();
  const {totalPnl, totalPnlRate, todayPnl} = summaryInfoResp?.data || {};

  const {onClickTrack} = useTracker();

  const {leadConfigId, copyConfigId} = useParams();
  const {gotoProfit} = useGotoProfit();

  const {gotoViewFollowSetting} = useGotoFollowSetting();
  const {data: summaryResp} = usePullSummaryQuery();

  const handleAgainCopyTrade = useMemoizedFn(() => {
    const {avatar: avatarUrl, nickName} = summaryResp?.data || {};

    onClickTrack({
      blockId: 'button',
      locationId: 'copyAgain',
    });

    gotoProfit({nickName, leadConfigId, avatarUrl});
  });

  const handleViewCopyTradeSetting = useMemoizedFn(() => {
    onClickTrack({
      blockId: 'button',
      locationId: 'setting',
    });

    gotoViewFollowSetting({leadConfigId, copyConfigId});
  });

  // 在历史跟单 tab 下 && 用户未跟单中 && 交易员未失效 && 带单员正常带单中
  const isShowCopyAgainBtn =
    !isLeadSummaryLoading &&
    isHistoryCopyTrader &&
    !isCopying &&
    TRADER_ACTIVE_STATUS.Disabled !== status &&
    !isLeadUnNormal;

  return (
    <View>
      <CopyTradeProfitWrapper>
        <FirstProfitLineWrap>
          <View>
            <DescText>
              {_t('3b9c1d238d034000a43f', {symbol: getBaseCurrency()})}
            </DescText>

            <TotalPnlWrap>
              <ProfitNumber isPositive isProfitNumber>
                {totalPnl}
              </ProfitNumber>
              {isActiveCurrentTab && (
                <ProfitNumberPercent isPositive beforeText="(" afterText=")">
                  {totalPnlRate}
                </ProfitNumberPercent>
              )}
            </TotalPnlWrap>
          </View>

          <View style={commonStyles.flexRowCenter}>
            {isActiveCurrentTab && (
              <Button
                size="mini"
                type="secondary"
                onPress={handleViewCopyTradeSetting}>
                {_t('0ff2cfa5547f4000a2c1')}
              </Button>
            )}

            {isShowCopyAgainBtn && (
              <Button
                size="mini"
                type="secondary"
                onPress={handleAgainCopyTrade}>
                {_t('23a0786bbca74000a2eb')}
              </Button>
            )}
          </View>
        </FirstProfitLineWrap>

        {isActiveCurrentTab && (
          <SecondProfitLineWrap>
            <View style={[commonStyles.flexRowCenter]}>
              <DescText>
                {_t('9da1781b73bc4000a54b', {symbol: getBaseCurrency()})}
              </DescText>
              <TinyProfit isProfitNumber>{todayPnl}</TinyProfit>
            </View>
          </SecondProfitLineWrap>
        )}
      </CopyTradeProfitWrapper>
      <ShowPositionType>
        {isActiveCurrentTab
          ? _t('bc9b32f96dc14000a40f')
          : _t('5e3a106471e64000a746')}
      </ShowPositionType>
    </View>
  );
};

export default memo(ProfitHeader);
