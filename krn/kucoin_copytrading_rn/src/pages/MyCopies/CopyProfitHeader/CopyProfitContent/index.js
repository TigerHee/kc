import React, {memo, useRef, useState} from 'react';
import {Animated, TouchableOpacity, View} from 'react-native';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import NumberFormat from 'components/Common/NumberFormat';
import {DownArrow, UpArrow} from 'components/Common/SvgIcon';
import TipTrigger from 'components/Common/TipTrigger';
import {RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {convertPxToReal} from 'utils/computedPx';
import {CopyPnlShare} from '../components/CopyPnlShare';
import MyCopyBannerLineChart from '../components/MyCopyBannerLineChart';
import {
  Circle,
  CopyProfitHeaderWrapper,
  CurrentCopyAmount,
  CurrentCopyAmountLabel,
  CurrentCopyAmountWrap,
  DescText,
  FirstProfitDescWrap,
  LargeProfit,
  makeDescTextStyle,
  SecondProfitLineWrap,
  TinyProfit,
} from './styles';

const containerStyle = css`
  overflow: hidden;
  align-items: center;
`;

const CopyProfitContent = ({copySummary}) => {
  const [expanded, setExpanded] = useState(true);
  const animation = useRef(new Animated.Value(0)).current;

  const {_t} = useLang();
  const theme = useTheme();

  const {
    totalPnlDateList = [],
    totalPnl,
    todayPnl,
    unrealisedPnl,
    currentInvestment,
  } = copySummary || {};

  const isAboveShowChartMinQuantity = totalPnlDateList.length > 3;

  const toggleExpand = () => {
    const finalValue = expanded ? 1 : 0;
    setExpanded(!expanded);
    Animated.timing(animation, {
      toValue: finalValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [convertPxToReal(137, false), 0],
  });
  const {onClickTrackInMainMyCopyPage} = useTracker();

  return (
    <CopyProfitHeaderWrapper>
      <FirstProfitDescWrap>
        <View>
          <RowWrap>
            <TipTrigger
              showUnderLine
              showIcon={false}
              textStyle={makeDescTextStyle(theme)}
              text={_t('44f5e297699d4000aeab', {symbol: getBaseCurrency()})}
              message={_t('0cc9f8c2279e4000a750')}
            />
            <CopyPnlShare
              totalPnl={totalPnl}
              totalPnlDateList={totalPnlDateList}
            />
          </RowWrap>

          <LargeProfit placeholder={0} isProfitNumber>
            {totalPnl}
          </LargeProfit>
        </View>

        {isAboveShowChartMinQuantity && (
          <TouchableOpacity activeOpacity={0.8} onPress={toggleExpand}>
            <Circle>{!expanded ? <DownArrow /> : <UpArrow />}</Circle>
          </TouchableOpacity>
        )}
      </FirstProfitDescWrap>
      {isAboveShowChartMinQuantity && (
        <Animated.View
          style={[containerStyle, {height: heightInterpolate}]}
          onTouchStart={() => {
            onClickTrackInMainMyCopyPage({
              blockId: 'head',
              locationId: 'chart',
            });
          }}>
          <MyCopyBannerLineChart pnlDateList={totalPnlDateList} />
        </Animated.View>
      )}

      <SecondProfitLineWrap
        style={css`
          margin-top: ${expanded ? '16px' : '6px'};
          margin-bottom: 2px;
        `}>
        <View>
          <TipTrigger
            showUnderLine
            showIcon={false}
            textStyle={makeDescTextStyle(theme)}
            text={_t('9da1781b73bc4000a54b', {symbol: getBaseCurrency()})}
            message={_t('8234ddf35b594000a350')}
          />

          <TinyProfit placeholder={0} isProfitNumber>
            {todayPnl}
          </TinyProfit>
        </View>

        <View>
          <DescText>
            {_t('29970099f0bf4000a6ac', {symbol: getBaseCurrency()})}
          </DescText>

          <TinyProfit placeholder={0} isProfitNumber>
            {unrealisedPnl}
          </TinyProfit>
        </View>
      </SecondProfitLineWrap>

      <CurrentCopyAmountWrap>
        <CurrentCopyAmountLabel>
          {_t('6a045433504b4000aef2', {symbol: getBaseCurrency()})}
        </CurrentCopyAmountLabel>
        <CurrentCopyAmount>
          <NumberFormat
            placeholder={0}
            style={css`
              font-weight: 500;
            `}
            isAumNumber>
            {currentInvestment}
          </NumberFormat>
        </CurrentCopyAmount>
      </CurrentCopyAmountWrap>
    </CopyProfitHeaderWrapper>
  );
};

export default memo(CopyProfitContent);
