/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useCallback, useMemo, useEffect, useState, useRef} from 'react';
import {TouchableWithoutFeedback, StyleSheet} from 'react-native';
import styled from '@emotion/native';
import {useSelector, useDispatch} from 'react-redux';
import {useTheme} from '@krn/ui';
import Bridge from 'utils/bridge';
import useLang from 'hooks/useLang';
import useSocket from 'hooks/useSocket';
import {
  _onClickTrack,
  _getHighLightsContent,
  _getHighLightsParamsObj,
} from 'components/Gembox/config';
import HeatPlate from 'components/Gembox/HeatPlate';
import HotView from './hotView';
import {getDecimalNumber, scientificToNumber} from 'utils/helper';

const WrapperView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 25px 0 0;
`;
const MarketView = styled.View`
  width: 140px;
  margin-right: 5px;
  justify-content: center;
  align-items: center;
`;
const PortraitView = styled.Image`
  width: 38px;
  height: 38px;
  border-radius: 50px;
  overflow: hidden;
`;
const NameView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 7px 0 10px;
  min-width: 50px;
  min-height: 15px;
  text-align: center;
`;
const NameText = styled.Text`
  font-size: 16px;
  color: #00142a;
  font-weight: normal;
  margin-right: 4px;
`;
const RateText = styled.Text`
  font-size: 12px;
`;
const PriceText = styled.Text`
  font-size: 20px;
  line-height: 22px;
  color: #00142a;
  font-weight: bold;
  min-width: 64px;
  min-height: 22px;
  text-align: center;
`;

const InfoView = styled.View`
  width: 216px;
  height: 102px;
  background: rgba(0, 20, 42, 0.04);
  border-radius: 8px;
  padding: 14px 0 12px;
  justify-content: space-between;
  flex-shrink: 1;
`;

const PeopleNumberText = styled.Text`
  font-size: 12px;
  color: rgba(0, 20, 42, 0.6);
  text-align: left;
  min-width: 136px;
  min-height: 11px;
  margin: 0 16px;
`;
const HotNumberView = styled.View`
  padding: 0 16px;
  flex-direction: row;
  justify-content: space-between;
`;
const HotTitleView = styled.View`
  flex-direction: row;
  align-items: center;
  flex-shrink: 1;
`;
const HotTitleDefault = styled.View`
  flex-shrink: 1;
  min-width: 100px;
`;
const HotNum = styled.Text`
  margin-left: 0px;
  color: rgba(0, 20, 42, 1);
  font-size: 22px;
  flex-shrink: 0;
  line-height: 24px;
`;
const HotNumDefault = styled.View`
  width: 30px;
  height: 24px;
  margin-left: 0px;
  line-height: 24px;
  flex-shrink: 0;
`;

const CoinInfo = () => {
  const {isRTL} = useTheme();
  const {_t, numberFormat} = useLang();
  const {marketColors} = useSelector(state => state.app || {});
  const {topOneInfo, isFav} = useSelector(state => state.gembox) || {};
  const {
    name,
    heatValue,
    iconUrl,
    tradingUserCount,
    symbolCode,
    changeRate,
    highLights = [],
  } = topOneInfo;
  const {socket, Topic} = useSocket();
  const [price, setPrice] = useState('');
  const [changeRateState, setChangeRateState] = useState('');
  const nowSymbolCode = useRef('');
  const dispatch = useDispatch();
  const allItemContent = useMemo(() => {
    return _getHighLightsContent(highLights);
  }, [highLights]);
  const getHighLightsParams = useMemo(() => {
    return _getHighLightsParamsObj(highLights);
  }, [highLights]);
  const goMarket = useCallback(
    type => {
      if (!symbolCode) {
        return;
      }
      Bridge.openNative(`/market?symbol=${symbolCode}`);
      // 点击埋点
      _onClickTrack({
        blockId: 'topOne',
        locationId: 1,
        properties: {
          postTitle: name,
          likes: heatValue,
          intervals: changeRate,
          allItemContent,
          yesOrNo: isFav,
          ...getHighLightsParams,
          clickPosition: type,
        },
      });
    },
    [
      allItemContent,
      changeRate,
      getHighLightsParams,
      heatValue,
      isFav,
      name,
      symbolCode,
    ],
  );

  useEffect(() => {
    // 监听返回消息
    socket.topicMessage(Topic.MARKET_SNAPSHOT, 'trade.snapshot')(
      arr => {
        const {data} = arr[0] || {};
        const {
          data: {
            lastTradedPrice,
            changeRate: _changeRate,
            symbolCode: _symbolCode,
          },
        } = data || {};
        if (_symbolCode !== nowSymbolCode.current) {
          // 不是当前币种，不使用
          return;
        }
        setPrice(lastTradedPrice.toString());
        setChangeRateState(_changeRate);
        // 其他地方埋点使用
        dispatch({
          type: 'gembox/update',
          payload: {
            changeRate: _changeRate,
          },
        });
      },
      500,
      true,
    );
  }, [Topic.MARKET_SNAPSHOT, dispatch, socket]);
  const formatPrice = useCallback((num, totalNumber) => {
    const number = Number(num);
    if (!number) {
      return 0;
    }
    let str = number.toString();
    const array = str.split('.');
    const len = str.length;
    if (len > totalNumber) {
      const decimal = array[1].substr(0, totalNumber - array[0].length - 1);
      str = `${array[0]}.${decimal}`;
    }
    str = scientificToNumber(str);
    return str;
  }, []);
  const formatRate = useCallback(num => {
    if (!num && (num !== '0' || num !== 0)) {
      return 0;
    }
    const number = Number(num) * 100;
    if (number < 0) {
      const str = number.toString();
      return {
        symbol: str.substr(0, 1),
        number: getDecimalNumber(str.substr(1, str.length - 1), 4, 2),
      };
    } else {
      return {
        symbol: '+',
        number: getDecimalNumber(number, 4, 2),
      };
    }
  }, []);
  const rate = changeRateState || topOneInfo.changeRate;
  const colors = {
    color: Number(rate) < 0 ? marketColors.down.color : marketColors.up.color,
    fill: Number(rate) < 0 ? marketColors.down.fill : marketColors.up.fill,
  };

  const rateIntl = v => {
    return numberFormat(v / 100, {
      options: {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
    });
  };

  return (
    <WrapperView>
      <TouchableWithoutFeedback onPress={() => goMarket('top')}>
        <MarketView>
          <PortraitView
            autoRotateDisable
            source={
              iconUrl ? {uri: iconUrl} : require('assets/gembox/defaultImg.png')
            }
          />
          {name ? (
            <NameView>
              <NameText>{name || '--'}</NameText>
              <RateText
                style={{
                  color: colors.color,
                }}>
                {formatRate(rate)
                  ? isRTL
                    ? `${rateIntl(formatRate(rate).number)}${
                        formatRate(rate).symbol
                      }`
                    : `${formatRate(rate).symbol}${rateIntl(
                        formatRate(rate).number,
                      )}`
                  : rateIntl(0)}
              </RateText>
            </NameView>
          ) : (
            <NameView style={styles.skeletonBg} />
          )}
          {name ? (
            <PriceText>
              {(price || topOneInfo.price, 12)
                ? formatPrice(price || topOneInfo.price, 12)
                : '--'}
            </PriceText>
          ) : (
            <PriceText style={styles.skeletonBg} />
          )}
        </MarketView>
      </TouchableWithoutFeedback>
      <InfoView
        style={name && !tradingUserCount ? styles.justifyContentCenter : null}>
        <HotView name={name} />
        <HotNumberView style={name ? null : {alignItems: 'flex-end'}}>
          {name ? (
            <HotTitleView>
              <HeatPlate width={12} height={11} hotNum={heatValue} />
            </HotTitleView>
          ) : (
            <HotTitleDefault style={styles.skeletonHotTitleView} />
          )}
          {name ? (
            <HotNum>
              {heatValue !== undefined ? Number(heatValue).toFixed(1) : '--'}
            </HotNum>
          ) : (
            <HotNumDefault style={styles.skeletonBg} />
          )}
        </HotNumberView>
        {name ? (
          tradingUserCount && tradingUserCount > 0 ? (
            <PeopleNumberText numberOfLines={2}>
              {_t('txjKwn78nb1Ts2hwtiYonA', {
                number: numberFormat(tradingUserCount),
              })}
            </PeopleNumberText>
          ) : null
        ) : (
          <PeopleNumberText style={styles.skeletonBg} />
        )}
      </InfoView>
    </WrapperView>
  );
};

const styles = StyleSheet.create({
  skeletonBg: {
    backgroundColor: 'rgba(0, 20, 42, 0.04)',
  },
  skeletonHotTitleView: {
    height: 16,
    backgroundColor: 'rgba(0, 20, 42, 0.04)',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
});
export default CoinInfo;
