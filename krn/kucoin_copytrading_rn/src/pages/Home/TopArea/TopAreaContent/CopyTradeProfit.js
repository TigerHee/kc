import {CopyPnlShare} from 'pages/MyCopies/CopyProfitHeader/components/CopyPnlShare';
import React, {memo, useMemo} from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import NumberFormat from 'components/Common/NumberFormat';
import {LongArrowRightIcon} from 'components/Common/SvgIcon';
import {Number} from 'components/Common/UpOrDownNumber';
import LineChart from 'components/copyTradeComponents/TraderInfoComponents/TraderInfoCard/LineChart';
import {commonStyles, RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import {convertTodayList2TotalPnlDate} from './helper';
import {
  DescText,
  FirstProfitLineWrap,
  LargeProfit,
  SecondProfitLineWrap,
  TinyProfit,
} from './styles';
import {useClick} from './useClick';

const CopyTradeProfit = ({summaryData}) => {
  const {
    totalPnl = 0,
    todayPnl = 0,
    currentInvestment = 0,
    totalPnlDateList,
  } = summaryData || {};
  const {colorV2} = useTheme();
  const {_t} = useLang();

  const totalPnlDate = useMemo(
    () => convertTodayList2TotalPnlDate(totalPnlDateList),
    [totalPnlDateList],
  );
  const {gotoMyCopiesWithTrack} = useClick();

  return (
    <Pressable onPress={gotoMyCopiesWithTrack}>
      <FirstProfitLineWrap>
        <View>
          <RowWrap>
            <DescText>
              {_t('0d7db9ab15a64000a94e', {symbol: getBaseCurrency()})}
            </DescText>

            <CopyPnlShare
              totalPnl={totalPnl}
              totalPnlDateList={totalPnlDateList}
            />
          </RowWrap>
          <LargeProfit>
            <Number isProfitNumber>{totalPnl}</Number>
          </LargeProfit>
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={gotoMyCopiesWithTrack}>
          <LongArrowRightIcon opacity={1} color={colorV2.text} />
        </TouchableOpacity>
      </FirstProfitLineWrap>

      <SecondProfitLineWrap>
        <View
          style={css`
            flex: 1;
            margin-top: 16px;
          `}>
          <RowWrap>
            <DescText>
              {_t('9da1781b73bc4000a54b', {symbol: getBaseCurrency()})}
            </DescText>
            <TinyProfit>
              <NumberFormat isProfitNumber>{todayPnl}</NumberFormat>
            </TinyProfit>
          </RowWrap>

          <View
            style={[
              commonStyles.flexRowCenter,
              css`
                margin-top: 6px;
              `,
            ]}>
            <DescText>
              {_t('6a045433504b4000aef2', {symbol: getBaseCurrency()})}
            </DescText>
            <TinyProfit>
              <NumberFormat isAumNumber>{currentInvestment}</NumberFormat>
            </TinyProfit>
          </View>
        </View>

        <View
          style={css`
            position: relative;
            bottom: 4px;
          `}>
          <Pressable
            onPress={gotoMyCopiesWithTrack}
            style={css`
              opacity: 0;
              width: 120px;
              z-index: 2;
              height: 50px;
              position: absolute;
            `}
          />
          <LineChart totalPnlDate={totalPnlDate} />
        </View>
      </SecondProfitLineWrap>
    </Pressable>
  );
};

export default memo(CopyTradeProfit);
