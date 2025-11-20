/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useCallback, useState, useEffect} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import styled from '@emotion/native';
import {useSelector, useDispatch} from 'react-redux';
import Tab from './Tab';
import Content from './Content';
import useLang from 'hooks/useLang';
import {TAB_MAP} from './config';
import {showDatetime} from 'utils/helper';

const TradeInfoView = styled.View`
  width: 100%;
  height: auto;
  margin-top: 20px;
`;
const UpdateView = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;
const TextWarpper = styled.View`
  flex-direction: row;
  align-items: center;
  min-width: 108px;
  height: 16px;
  border-radius: 1px;
`;
const UpdateInfo = styled.Text`
  font-size: 12px;
  color: rgba(0, 20, 42, 0.6);
`;
const RefreshImg = styled.Image`
  width: 16px;
  height: 16px;
  margin-left: 6px;
`;

const TradeInfo = props => {
  const {onRefresh} = props;
  const {_t} = useLang();
  const dispatch = useDispatch();
  const {topOneInfo} = useSelector(state => state.gembox) || {};
  const {name} = topOneInfo;
  const [activeStatus, setActiveStatus] = useState(TAB_MAP.buy);
  const onTabChange = useCallback(val => {
    setActiveStatus(val);
  }, []);

  useEffect(() => {
    if (name) {
      getTradeLists(name);
    }
  }, [getTradeLists, name]);
  const getTradeLists = useCallback(
    currency => {
      queryTradeDetail({
        currency,
        tradeType: 'BROADCAST',
        tradeDirection: 'BUY',
      });
      queryTradeDetail({
        currency,
        tradeType: 'BROADCAST',
        tradeDirection: 'SELL',
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

  return (
    <TradeInfoView>
      <TouchableOpacity activeOpacity={0.6} onPress={() => onRefresh('button')}>
        <UpdateView>
          {name ? (
            <TextWarpper>
              <UpdateInfo>
                {_t('wTya2iQwj1dbJHVPsVHXNh', {
                  time: showDatetime(Date.now(), 'hh:mm'),
                })}
              </UpdateInfo>
              <RefreshImg source={require('assets/gembox/refresh.png')} />
            </TextWarpper>
          ) : (
            <TextWarpper style={styles.skeletonBg} />
          )}
        </UpdateView>
      </TouchableOpacity>
      <Tab onChange={onTabChange} activeStatus={activeStatus} />
      <Content activeStatus={activeStatus} />
    </TradeInfoView>
  );
};
const styles = StyleSheet.create({
  skeletonBg: {
    backgroundColor: 'rgba(0, 20, 42, 0.04)',
  },
});
export default TradeInfo;
