import React, {memo, useRef, useState} from 'react';
import {
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import NumberFormat from 'components/Common/NumberFormat';
import {DownArrow, MyLeadProfitArrow, UpArrow} from 'components/Common/SvgIcon';
import TipTrigger from 'components/Common/TipTrigger';
import {Number} from 'components/Common/UpOrDownNumber';
import {RouterNameMap} from 'constants/router-name-map';
import {RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import {usePush} from 'hooks/usePush';
import useTracker from 'hooks/useTracker';
import {convertPxToReal} from 'utils/computedPx';
import LeadingInfoArea from '../components/LeadingInfoArea';
import {LeadPnlShare} from '../components/LeadPnlShare';
import MyLeadingBannerLineChart from '../components/MyLeadingBannerLineChart';
import {TopAlert} from '../components/TopAlert';
import {
  AmountText,
  Circle,
  CopyProfitHeaderWrapper,
  CurrentCopyAmountLabel,
  CurrentCopyAmountWrap,
  DescText,
  FirstProfitDescWrap,
  LargeProfit,
  makeDescTextStyle,
  SecondProfitLineWrap,
  ShareProfitBox,
  ShareProfitItem,
  TinyProfit,
} from './styles';

const containerStyle = css`
  overflow: hidden;
  align-items: center;
`;

const ProfitContent = ({leadSummary}) => {
  const {_t} = useLang();
  const [expanded, setExpanded] = useState(true);
  const {push} = usePush();
  const animation = useRef(new Animated.Value(0)).current;
  const {colorV2} = useTheme();

  const {onClickTrackInMainMyLeadPage} = useTracker();

  const {
    unrealizedProfitSharingAmount,
    cumulativeProfitSharingAmount,
    todayPnl,
    totalPnl,
    unrealizedPnl,
    aum,
    avatar,
    nickName,
    sufficientInitAmount,
    timeCycleStatisticList,
    leadStatus,
  } = leadSummary || {};

  const gotoMyEarnSharingPage = isUnProfitShare => {
    onClickTrackInMainMyLeadPage({
      blockId: 'head',
      locationId: isUnProfitShare ? 'profitShare' : 'profitShareHistory',
    });

    push(RouterNameMap.MyEarnProfit, {
      isUnProfitShare: isUnProfitShare ? 'true' : 'false',
    });
  };

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

  const isAboveShowChartMinQuantity = timeCycleStatisticList?.length > 3;

  return (
    <CopyProfitHeaderWrapper>
      <TopAlert leadStatus={leadStatus} />
      <LeadingInfoArea
        canLead={sufficientInitAmount}
        avatarUrl={avatar}
        nickName={nickName}
        leadStatus={leadStatus}
      />

      <FirstProfitDescWrap>
        <View>
          <RowWrap>
            <TipTrigger
              showUnderLine
              showIcon={false}
              textStyle={makeDescTextStyle(colorV2)}
              text={_t('44f5e297699d4000aeab', {symbol: getBaseCurrency()})}
              message={_t('3fd610759f434000ade9')}
            />

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
        </View>

        {isAboveShowChartMinQuantity && (
          <TouchableOpacity activeOpacity={0.8} onPress={toggleExpand}>
            <Circle>{!expanded ? <DownArrow /> : <UpArrow />}</Circle>
          </TouchableOpacity>
        )}
      </FirstProfitDescWrap>
      {isAboveShowChartMinQuantity && (
        <Animated.View style={[containerStyle, {height: heightInterpolate}]}>
          <MyLeadingBannerLineChart pnlList={timeCycleStatisticList} />
        </Animated.View>
      )}

      <SecondProfitLineWrap
        style={css`
          margin-top: ${expanded
            ? isAboveShowChartMinQuantity
              ? '20px'
              : '16px'
            : '4px'};
          margin-bottom: 2px;
        `}>
        <View
          style={css`
            flex: 1;
          `}>
          <TipTrigger
            showUnderLine
            showIcon={false}
            textStyle={makeDescTextStyle(colorV2)}
            text={_t('9da1781b73bc4000a54b', {symbol: getBaseCurrency()})}
            message={_t('3fc2c31d4c174000aadb')}
          />
          <TinyProfit>
            <Number
              style={css`
                font-weight: 500;
              `}
              isProfitNumber>
              {todayPnl}
            </Number>
          </TinyProfit>
        </View>

        <View
          style={css`
            flex: 1;
          `}>
          <DescText>
            {_t('29970099f0bf4000a6ac', {symbol: getBaseCurrency()})}
          </DescText>
          <TinyProfit>
            <Number
              style={css`
                font-weight: 500;
              `}
              isProfitNumber>
              {unrealizedPnl}
            </Number>
          </TinyProfit>
        </View>
      </SecondProfitLineWrap>

      <CurrentCopyAmountWrap>
        <RowWrap
          style={css`
            margin-bottom: 12px;
          `}>
          <CurrentCopyAmountLabel
            style={css`
              margin-right: 4px;
            `}>
            {_t('271f84be314e4000abb6', {symbol: getBaseCurrency()})}
          </CurrentCopyAmountLabel>
          <AmountText>
            <NumberFormat
              style={css`
                font-weight: 500;
              `}
              isProfitNumber>
              {aum}
            </NumberFormat>
          </AmountText>
        </RowWrap>

        <ShareProfitBox>
          <TouchableWithoutFeedback
            onPress={() => gotoMyEarnSharingPage(false)}>
            <ShareProfitItem>
              <TipTrigger
                textStyle={makeDescTextStyle(colorV2)}
                showUnderLine
                showIcon={false}
                text={_t('572ef8ed680e4000ac6f', {symbol: getBaseCurrency()})}
                message={_t('cdd08d72db424000a578')}
              />

              <RowWrap>
                <AmountText style={{marginRight: 4}}>
                  <NumberFormat
                    isProfitNumber
                    style={css`
                      font-weight: 500;
                    `}>
                    {cumulativeProfitSharingAmount}
                  </NumberFormat>
                </AmountText>
                <MyLeadProfitArrow />
              </RowWrap>
            </ShareProfitItem>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => gotoMyEarnSharingPage(true)}>
            <ShareProfitItem
              style={css`
                margin-top: 10px;
              `}>
              <TipTrigger
                textStyle={makeDescTextStyle(colorV2)}
                showUnderLine
                showIcon={false}
                text={_t('14e6957efdc74000a351', {symbol: getBaseCurrency()})}
                message={_t('4d8cc64fef994000aa31')}
              />
              <RowWrap>
                <AmountText style={{marginRight: 4}}>
                  <NumberFormat
                    isProfitNumber
                    style={css`
                      font-weight: 500;
                    `}>
                    {unrealizedProfitSharingAmount}
                  </NumberFormat>
                </AmountText>
                <MyLeadProfitArrow />
              </RowWrap>
            </ShareProfitItem>
          </TouchableWithoutFeedback>
        </ShareProfitBox>
      </CurrentCopyAmountWrap>

      {/* <TransferAccountTipCard hidden={!isFetched || sufficientInitAmount} /> */}
    </CopyProfitHeaderWrapper>
  );
};

export default memo(ProfitContent);
