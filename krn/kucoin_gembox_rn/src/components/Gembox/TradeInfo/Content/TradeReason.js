/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import styled from '@emotion/native';
import {openNative} from '@krn/bridge';
import {TAB_MAP, HIGHLIGHTS_MAP_BUY, HIGHLIGHTS_MAP_SELL} from '../config';
import useLang from 'hooks/useLang';
import {
  _onExpose,
  _onClickTrack,
  TRADE_TYPE_MAP_TEXT,
} from 'components/Gembox/config';
import {forEach} from 'lodash';
import {showDatetime} from 'utils/helper';

const TradeReasonView = styled.View`
  width: 100%;
  margin-top: -5px;
`;
const TitleText = styled.Text`
  font-size: 12px;
  color: rgba(0, 20, 42, 0.6);
  margin-bottom: 5px;
`;
const ItemView = styled.View`
  background: rgba(0, 20, 42, 0.04);
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;
const TitleImg = styled.Image`
  width: 20px;
  height: 20px;
  margin: 0 4px 0 9px;
`;
const InfoView = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding-right: 17px;
`;
const InfoText = styled.Text`
  flex: 1;
  font-size: 14px;
  color: rgba(0, 20, 42, 0.6);
  margin: 10px 0;
`;
const SubInfoText = styled.Text`
  font-size: 14px;
  color: rgba(0, 20, 42, 0.6);
  margin: 10px 0;
`;
const ThumbsUpView = styled.View`
  margin: 0 11px;
  flex-direction: row;
  align-items: center;
`;
const ThumbsUpImg = styled.Image`
  width: 10px;
  height: 10px;
  margin-right: 2px;
`;
const ThumbsUpNumber = styled.Text`
  font-size: 12px;
`;
const ArrowImg = styled.Image`
  width: 12px;
  height: 12px;
  margin: 0 5px;
  flex-shrink: 0;
`;
const TimeText = styled.Text`
  font-size: 14px;
  color: rgba(0, 20, 42, 0.6);
`;
const TradeReason = props => {
  const {_t} = useLang();
  const dispatch = useDispatch();
  const {activeStatus, openOrderInfoSheet, type, list} = props;
  const {isLogin} = useSelector(state => state.app);
  const {topOneInfo} = useSelector(state => state.gembox) || {};
  const loading = useSelector(state => state.loading);
  const likeReasonLoading = loading.effects['gembox/likeCurrencyReason'];
  const {name} = topOneInfo;
  const [exposeBuyReason, setExposeBuyReason] = useState('');
  const [exposeSellReason, setExposeSellReason] = useState('');

  const getThumbsUpStatus = useCallback(
    ({isLike}) => {
      let thumbsUpColor;
      let thumbsUpImgUrl;
      if (!isLike) {
        thumbsUpColor = styles.gray;
        thumbsUpImgUrl = require('assets/gembox/ThumbsUpGray.png');
      } else if (activeStatus === TAB_MAP.buy) {
        thumbsUpColor = styles.green;
        thumbsUpImgUrl = require('assets/gembox/ThumbsUpGreen.png');
      } else {
        thumbsUpColor = styles.red;
        thumbsUpImgUrl = require('assets/gembox/ThumbsUpRed.png');
      }
      return {
        thumbsUpColor,
        thumbsUpImgUrl,
      };
    },
    [activeStatus],
  );
  const thumbsUp = useCallback(
    ({tradeDirection, type: highLightType}, isLike, _index) => {
      if (isLogin) {
        if (likeReasonLoading) {
          return;
        }
        dispatch({
          type: 'gembox/likeCurrencyReason',
          payload: {
            currency: name,
            highLight: highLightType,
            tradeDirection,
          },
        });
        // 点击埋点
        _onClickTrack({
          blockId: 'likeButton',
          locationId: 1,
          properties: {
            contentType: TRADE_TYPE_MAP_TEXT[highLightType] || '',
            actionType: isLike ? 'cancel' : 'like',
            sortPosition: _index, // 排序
            position: activeStatus === TAB_MAP.buy ? 'buyBlock' : 'sellBlock',
          },
        });
      } else {
        openNative('/user/login');
      }
    },
    [activeStatus, dispatch, isLogin, likeReasonLoading, name],
  );
  const openSheet = useCallback(() => {
    queryTradeDetail();
    openOrderInfoSheet(type);
  }, [queryTradeDetail, openOrderInfoSheet, type]);

  const queryTradeDetail = useCallback(() => {
    dispatch({
      type: 'gembox/queryTradeDetail',
      payload: {
        currency: name,
        tradeType: 'BIG_ORDER',
        tradeDirection: 'BUY',
      },
    });
    dispatch({
      type: 'gembox/queryTradeDetail',
      payload: {
        currency: name,
        tradeType: 'BIG_ORDER',
        tradeDirection: 'SELL',
      },
    });
  }, [dispatch, name]);

  useEffect(() => {
    if (name && activeStatus === TAB_MAP.buy && name !== exposeBuyReason) {
      forEach(list || [], item => {
        const {type: _type} = item || {};
        if (TRADE_TYPE_MAP_TEXT[_type]) {
          _onExpose({
            blockId: 'highlight',
            locationId: 1,
            properties: {
              contentType: TRADE_TYPE_MAP_TEXT[_type],
              position: 'buyBlock',
            },
          });
        }
      });
      setExposeBuyReason(name);
    }
    if (name && activeStatus === TAB_MAP.sell && name !== exposeSellReason) {
      forEach(list || [], item => {
        const {type: _type} = item || {};
        if (TRADE_TYPE_MAP_TEXT[_type]) {
          _onExpose({
            blockId: 'highlight',
            locationId: 1,
            properties: {
              contentType: TRADE_TYPE_MAP_TEXT[_type],
              position: 'sellBlock',
            },
          });
        }
      });
      setExposeSellReason(name);
    }
  }, [name, activeStatus, exposeBuyReason, exposeSellReason, list]);

  const reasonAction = useCallback(
    _type => {
      if (_type === 'BIG_ORDER') openSheet();
      // 点击埋点
      _onClickTrack({
        blockId: 'highlight',
        locationId: 1,
        properties: {
          contentType: TRADE_TYPE_MAP_TEXT[_type] || '',
          position: activeStatus === TAB_MAP.buy ? 'buyBlock' : 'sellBlock',
        },
      });
    },
    [activeStatus, openSheet],
  );
  const notNoList = useCallback(() => {
    const configObj =
      activeStatus === TAB_MAP.buy ? HIGHLIGHTS_MAP_BUY : HIGHLIGHTS_MAP_SELL;
    // 查询list是否有需要展示的理由, 在有action的配置里，param为0也不展示
    return list.some(i => {
      if (configObj[i.type]?.action && !Number(i.param)) {
        return false;
      } else if (!configObj[i.type]) {
        return false;
      }
      return true;
    });
  }, [activeStatus, list]);
  if (!notNoList()) {
    return null;
  }
  return (
    <TradeReasonView>
      <TitleText>
        {activeStatus === TAB_MAP.buy
          ? _t('qHUwnDDLPg6K95TPyRY2Bd')
          : _t('3xVXrcsKUVWkwNw9TjPkQG')}
      </TitleText>
      {list.map((item, index) => {
        const {
          description,
          param,
          title,
          tradeDirection,
          type: _type,
          likeCount,
          isLike,
        } = item;
        const {imgUrl, action, userDes, showTime} =
          activeStatus === TAB_MAP.buy
            ? HIGHLIGHTS_MAP_BUY[_type] || {}
            : HIGHLIGHTS_MAP_SELL[_type] || {};
        const {thumbsUpColor, thumbsUpImgUrl} = getThumbsUpStatus(item);
        if (action) {
          if (!Number(param)) {
            return null;
          }
          return (
            <ItemView key={index}>
              <TitleImg source={imgUrl} />
              <TouchableOpacity
                style={styles.flexFull}
                activeOpacity={0.6}
                onPress={() => reasonAction(_type, param)}>
                <InfoView>
                  <SubInfoText numberOfLines={2}>
                    {_type === 'BIG_ORDER'
                      ? _t(
                          tradeDirection === 'BUY'
                            ? 'kFK2UxsBB9zmFf6HHrvjtU'
                            : 'tWgzTZsvw4A4Pf8Rp5Aw5f',
                          {number: param},
                        )
                      : userDes
                      ? description
                      : title}
                  </SubInfoText>
                  <ArrowImg source={require('assets/gembox/ArrowLight.png')} />
                </InfoView>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => thumbsUp(item, isLike, index)}>
                <ThumbsUpView>
                  <ThumbsUpImg source={thumbsUpImgUrl} />
                  <ThumbsUpNumber style={thumbsUpColor}>
                    {likeCount}
                  </ThumbsUpNumber>
                </ThumbsUpView>
              </TouchableOpacity>
            </ItemView>
          );
        }
        if (imgUrl) {
          return (
            <ItemView key={index}>
              <TitleImg source={imgUrl} />
              <InfoText numberOfLines={2}>
                {showTime ? (
                  <TimeText>{showDatetime(param, 'hh:mm')} </TimeText>
                ) : null}
                {description}
              </InfoText>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => thumbsUp(item, isLike, index)}>
                <ThumbsUpView>
                  <ThumbsUpImg source={thumbsUpImgUrl} />
                  <ThumbsUpNumber style={thumbsUpColor}>
                    {likeCount}
                  </ThumbsUpNumber>
                </ThumbsUpView>
              </TouchableOpacity>
            </ItemView>
          );
        }
      })}
    </TradeReasonView>
  );
};

const styles = StyleSheet.create({
  gray: {
    color: 'color: rgba(0, 20, 42, 0.4)',
  },
  green: {
    color: '#21C397',
  },
  red: {
    color: '#ED6666',
  },
  flexFull: {
    flex: 1,
  },
});
export default TradeReason;
