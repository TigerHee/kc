/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import styled from '@emotion/native';
import {useSelector} from 'react-redux';
import useLang from 'hooks/useLang';
import ItemFade from './ItemFade';
import {TAB_MAP, BROADCAST_MAP} from '../config';
import {TRADE_TYPE_MAP} from '../../config';

import {unitConverter} from 'utils/helper';

const Wrapper = styled.View`
  width: 100%;
  height: 32px;
`;
const WrapperView = styled.View`
  width: 100%;
  padding: 14px 12px 0;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const TypeImg = styled.Image`
  width: 16px;
  height: 16px;
  margin-right: 3px;
`;
const BroadcastText = styled.Text`
  font-size: 12px;
  color: rgba(0, 20, 42, 0.6);
`;
const ListItem = props => {
  const {type, activeStatus, param, volValue} = props;
  const {_t} = useLang();
  const getMinutes = useCallback(time => {
    const _time = Number(time) || 0;
    const now = Date.now();
    return Math.ceil((now - _time) / 1000 / 60);
  }, []);
  if (!BROADCAST_MAP[type]) {
    return null;
  }
  if (type === TRADE_TYPE_MAP.BIG_ORDER) {
    return (
      <WrapperView>
        <TypeImg
          source={
            activeStatus === TAB_MAP.buy
              ? require('assets/gembox/MoneyGreen.png')
              : require('assets/gembox/MoneyRed.png')
          }
        />
        <BroadcastText>
          {_t(
            activeStatus === TAB_MAP.buy
              ? BROADCAST_MAP[type].buyTextKey
              : BROADCAST_MAP[type].sellTextKey,
            {time: getMinutes(param), money: unitConverter(volValue)},
          )}
        </BroadcastText>
      </WrapperView>
    );
  }
  return (
    <WrapperView>
      <TypeImg source={BROADCAST_MAP[type].img} />
      <BroadcastText>
        {_t(
          activeStatus === TAB_MAP.buy
            ? BROADCAST_MAP[type].buyTextKey
            : BROADCAST_MAP[type].sellTextKey,
          {time: getMinutes(param)},
        )}
      </BroadcastText>
    </WrapperView>
  );
};
const Broadcast = props => {
  const {activeStatus} = props;
  const {broadcast_buy, broadcast_sell} =
    useSelector(state => state.gembox) || {};
  const list = activeStatus === TAB_MAP.buy ? broadcast_buy : broadcast_sell;
  if (!list || !list.length) {
    return null;
  }
  if (list.length === 1) {
    return (
      <Wrapper>
        <ListItem {...list[0]} activeStatus={activeStatus} />
      </Wrapper>
    );
  }
  return (
    <ItemFade
      key={list[0].param}
      duration={1000}
      delay={5000}
      list={list.map(i => {
        return <ListItem {...i} activeStatus={activeStatus} key={i.param} />;
      })}
      style={styles.wrapper}
    />
  );
};
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 32,
    position: 'relative',
  },
});
export default Broadcast;
