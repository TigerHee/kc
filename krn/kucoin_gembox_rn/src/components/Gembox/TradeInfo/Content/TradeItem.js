/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useCallback, useMemo} from 'react';
import {useDispatch} from 'react-redux';
import {TouchableOpacity, StyleSheet} from 'react-native';
import styled from '@emotion/native';
import useLang from 'hooks/useLang';
import {TAB_MAP, USER_TREADEINFO_TAB_MAP} from '../config';

const TradeItemView = styled.View`
  width: 100%;
  height: 40px;
  background: #ffffff;
  border: 1px solid ${({theme}) => theme.color.complementary};
  border-radius: 8px;
  position: relative;
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;
const PortraitBuyBg = styled.Image`
  position: absolute;
  height: 100%;
  background: rgba(33, 195, 151, 0.24);
  top: 0;
  left: 0;
`;
const PortraitSellBg = styled.Image`
  position: absolute;
  height: 100%;
  background: rgba(237, 102, 102, 0.24);
  top: 0;
  right: 0;
`;
const Arrow = styled.Image`
  width: 16px;
  height: 16px;
  margin: 0 8px 0 8px;
`;
const PortraitView = styled.Image`
  width: 16px;
  height: 16px;
  margin: 0 8px 0 12px;
`;
const TextWrapper = styled.View`
  flex-direction: row;
  flex: 1;
  min-height: 14px;
`;
const InfoText = styled.Text`
  font-size: 14px;
  color: #00142a;
`;
const TradeItem = props => {
  const {_t, numberFormat} = useLang();
  const dispatch = useDispatch();
  const {activeStatus, name, openUserTradeInfoSheet, type, source = []} = props;
  const {param = ''} = source[0] || {};

  const openSheet = useCallback(() => {
    getTradeLists(name);
    openUserTradeInfoSheet(type);
  }, [getTradeLists, openUserTradeInfoSheet, type, name]);

  const getTradeLists = useCallback(
    currency => {
      queryTradeDetail({
        currency,
        tradeType: 'BIG_MONEY',
        tradeDirection: 'ALL',
      });
      queryTradeDetail({
        currency,
        tradeType: 'PRO_TRADER',
        tradeDirection: 'ALL',
      });
    },
    [queryTradeDetail],
  );

  const queryTradeDetail = useCallback(
    payload => {
      dispatch({
        type: 'gembox/queryTradeDetail',
        payload,
      });
    },
    [dispatch],
  );

  const dealPercent = v => {
    return numberFormat(v.replace('%', '') / 100, {
      options: {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
    });
  };

  const buyText = useMemo(() => {
    let _number = param || '';
    let str =
      type === USER_TREADEINFO_TAB_MAP.BIG_MONEY
        ? _t('vHTyF83fuW3sARsk2QDii1', {percent: dealPercent(param)})
        : _t('xmfXAeaKHgMpGFfEn9c8k2', {percent: dealPercent(param)});
    if (_number.indexOf('%') === -1) {
      str =
        type === USER_TREADEINFO_TAB_MAP.BIG_MONEY
          ? _t('6KQ43BGLqKAbEa6EB3S1FM', {number: param})
          : _t('weGfVGpAA2WM8V3aPpjdW9', {number: param});
    }

    return str;
  }, [_t, type, param]);

  const sellText = useMemo(() => {
    let _number = param || '';
    let str =
      type === USER_TREADEINFO_TAB_MAP.BIG_MONEY
        ? _t('k6Ptu4wMkGmbccrAiKy6ZS', {percent: dealPercent(param)})
        : _t('hNm4M1CrwFiDc6WY6sXbaw', {percent: dealPercent(param)});
    if (_number.indexOf('%') === -1) {
      str =
        type === USER_TREADEINFO_TAB_MAP.BIG_MONEY
          ? _t('tTKWUY6Rmhqn6HpnGgrfWS', {number: param})
          : _t('hE9BMrCKWZSMmU6oMV5b8o', {number: param});
    }
    return str;
  }, [_t, type, param]);

  if (name && (param === '0' || !param)) {
    return null;
  }
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={openSheet}>
      <TradeItemView>
        {name ? (
          activeStatus === TAB_MAP.buy ? (
            <PortraitBuyBg
              style={param && param.indexOf('%') > -1 ? {width: param} : null}
            />
          ) : (
            <PortraitSellBg
              style={param && param.indexOf('%') > -1 ? {width: param} : null}
            />
          )
        ) : null}
        <PortraitView
          source={
            type === USER_TREADEINFO_TAB_MAP.BIG_MONEY
              ? require('assets/gembox/OrangePerson.png')
              : require('assets/gembox/BluePerson.png')
          }
        />
        {name ? (
          <TextWrapper>
            <InfoText numberOfLines={1}>
              <InfoText>
                {activeStatus === TAB_MAP.buy ? buyText : sellText}
              </InfoText>
            </InfoText>
          </TextWrapper>
        ) : (
          <TextWrapper style={styles.skeletonBg} />
        )}
        <Arrow source={require('assets/gembox/ArrowRight.png')} />
      </TradeItemView>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  skeletonBg: {
    backgroundColor: 'rgba(0, 20, 42, 0.04)',
  },
});
export default TradeItem;
