import {LeadPnlShare} from 'pages/MyLeading/ProfitHeader/components/LeadPnlShare';
import {TopAlert} from 'pages/MyLeading/ProfitHeader/components/TopAlert';
import React, {memo} from 'react';
import {Pressable, View} from 'react-native';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import NumberFormat from 'components/Common/NumberFormat';
import {LongArrowRightIcon} from 'components/Common/SvgIcon';
import {Number} from 'components/Common/UpOrDownNumber';
import LineChart from 'components/copyTradeComponents/TraderInfoComponents/TraderInfoCard/LineChart';
import {BetweenWrap, RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import {safeArray} from 'utils/helper';
import {
  CurrentCopyAmount,
  CurrentCopyAmountLabel,
  CurrentCopyAmountWrap,
  DescText,
  FirstProfitLineWrap,
  HomeTopRightArrowWrap,
  HomeTopRightChartWrap,
  LargeProfit,
  TinyProfit,
  Wrap,
} from './styles';
import {useClick} from './useClick';

const LeadTradeProfit = props => {
  const {summaryData = {}, myCopySummaryData = {}} = props;
  const {timeCycleStatisticList} = summaryData;
  const {_t} = useLang();
  const {colorV2} = useTheme();

  const {totalPnl, unrealizedPnl, leadStatus} = summaryData || {};
  const {todayPnl: todayCopyTradePnl} = myCopySummaryData || {};

  const {gotoMyCopiesWithTrack, gotoMyLeadWithTrack} = useClick();

  return (
    <Wrap onPress={gotoMyLeadWithTrack}>
      <TopAlert leadStatus={leadStatus} />
      {/* <BetweenWrap
        style={css`
          margin-bottom: 1px;
        `}>
        <TouchableWithoutFeedback
          style={css`
            flex: 1;
          `}
          onPress={gotoMyLeadWithTrack}>
          <RowWrap
            style={css`
              flex: 1;
            `}>
            <LendTitle>{_t('04b9d3a78ebd4000a68e')}</LendTitle>
            <LongArrowRightIcon />
          </RowWrap>
        </TouchableWithoutFeedback>
        <Button size="small" onPress={launchLeadOrderWithTrack}>
          {_t('e112fe43b1194000a36a')}
        </Button>
      </BetweenWrap> */}

      <FirstProfitLineWrap>
        <Pressable onPress={gotoMyLeadWithTrack}>
          <RowWrap>
            <DescText>
              {_t('44f5e297699d4000aeab', {symbol: getBaseCurrency()})}
            </DescText>

            <LeadPnlShare
              timeCycleStatisticList={timeCycleStatisticList}
              totalPnl={totalPnl}
            />
          </RowWrap>
          <LargeProfit>
            <Number isProfitNumber style={{fontWeight: '600'}}>
              {totalPnl}
            </Number>
          </LargeProfit>

          <DescText
            style={css`
              margin-top: 8px;
              margin-bottom: 2px;
            `}>
            {_t('29970099f0bf4000a6ac', {symbol: getBaseCurrency()})}
          </DescText>
          <TinyProfit
            style={css`
              margin-left: 0;
            `}>
            <NumberFormat
              style={css`
                font-weight: 500;
              `}
              isProfitNumber
              isPositive>
              {unrealizedPnl}
            </NumberFormat>
          </TinyProfit>
        </Pressable>

        <View
          style={css`
            position: relative;
            bottom: 4px;
          `}>
          <HomeTopRightArrowWrap onPress={gotoMyLeadWithTrack}>
            <LongArrowRightIcon color={colorV2.text} opacity={1} />
          </HomeTopRightArrowWrap>

          <HomeTopRightChartWrap>
            <Pressable
              onPress={gotoMyLeadWithTrack}
              style={css`
                opacity: 0;
                width: 120px;
                z-index: 2;
                height: 50px;
                position: absolute;
              `}
            />
            <LineChart
              totalPnlDate={safeArray(timeCycleStatisticList).map(i => i.pnl)}
            />
          </HomeTopRightChartWrap>
        </View>
      </FirstProfitLineWrap>
      {/* // UX： 金额为 0 隐藏 */}
      {todayCopyTradePnl && +todayCopyTradePnl !== 0 ? (
        <CurrentCopyAmountWrap onPress={gotoMyCopiesWithTrack}>
          <BetweenWrap>
            <RowWrap
              style={css`
                flex-wrap: wrap;
                flex: 1;
              `}>
              <CurrentCopyAmountLabel numberOfLines={2}>
                {_t('ea164b2a97cc4000a091', {symbol: getBaseCurrency()})}
              </CurrentCopyAmountLabel>
              <CurrentCopyAmount isProfitNumber isPositive>
                {todayCopyTradePnl}
              </CurrentCopyAmount>
            </RowWrap>

            <LongArrowRightIcon />
          </BetweenWrap>
        </CurrentCopyAmountWrap>
      ) : null}
    </Wrap>
  );
};

export default memo(LeadTradeProfit);
