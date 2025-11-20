/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useCallback, useState, useEffect, useMemo} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from '@emotion/native';
import {Drawer} from '@krn/ui';
import CommonTab from '../CommonTab';
import TabContent from './TabContent';
import {TAB_MAP} from '../config';
import useLang from 'hooks/useLang';
import {forEach} from 'lodash';

const WrapperView = styled.View`
  width: 100%;
  height: 550px;
  border-radius: 10px;
  background: #fff;
  justify-content: space-between;
`;

const Blank = styled.View`
  background: #fff;
`;
const TabBtnView = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
`;
const ActiveBar = styled.View`
  width: 24px;
  height: 4px;
  position: absolute;
  bottom: 0px;
  background: #21c397;
  border-radius: 12px;
`;
const TabBtnText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: rgba(0, 20, 42, 0.4);
`;

const TabBtn = props => {
  const {onChangeTab, activeTab, activeName, text} = props;
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => onChangeTab(activeName)}>
      <TabBtnView>
        <TabBtnText
          style={activeTab === activeName ? styles.activeTabStyle : null}>
          {text}
        </TabBtnText>
        {activeTab === activeName && <ActiveBar />}
      </TabBtnView>
    </TouchableOpacity>
  );
};
const OrderInfoSheet = props => {
  const {_t} = useLang();
  const {defaultActiveTab} = props;
  const {openOrderInfoSheet, bigOrdersBuy, bigOrdersSell, topOneInfo} =
    useSelector(state => state.gembox) || {};
  const {highLights = []} = topOneInfo;
  const [activeTab, setActiveTab] = useState(TAB_MAP.buy);

  const orderLength = useMemo(() => {
    let buyLength = 0;
    let sellLength = 0;
    forEach(highLights || [], (item, index) => {
      const {type, tradeDirection, param} = item;
      if (type === 'BIG_ORDER' && tradeDirection === TAB_MAP.buy) {
        buyLength = param;
      }
      if (type === 'BIG_ORDER' && tradeDirection === TAB_MAP.sell) {
        sellLength = param;
      }
    });
    return {
      buyLength,
      sellLength,
    };
  }, [highLights]);

  const dispatch = useDispatch();
  const onChangeTab = useCallback(val => {
    setActiveTab(val);
  }, []);
  useEffect(() => {
    if (openOrderInfoSheet) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab, openOrderInfoSheet]);
  const onClose = useCallback(() => {
    dispatch({
      type: 'gembox/update',
      payload: {
        openOrderInfoSheet: false,
      },
    });
  }, [dispatch]);

  return (
    <Drawer
      id="user-drawer"
      show={openOrderInfoSheet}
      onClose={onClose}
      leftSlot={<Blank />}
      header={<Blank />}>
      <WrapperView>
        <CommonTab
          tabLeft={
            <TabBtn
              onChangeTab={onChangeTab}
              activeTab={activeTab}
              activeName={TAB_MAP.buy}
              text={
                _t('nRaepbPTi7m2tUArCVg6QL') +
                `(${orderLength.buyLength || bigOrdersBuy.length})`
              }
            />
          }
          tabRight={
            <TabBtn
              onChangeTab={onChangeTab}
              activeTab={activeTab}
              activeName={TAB_MAP.sell}
              text={
                _t('qV2W6zfyAWwTASvYqaaXnU') +
                `(${orderLength.sellLength || bigOrdersSell.length})`
              }
            />
          }
          content={
            <TabContent
              activeTab={activeTab}
              dataSource={
                activeTab === TAB_MAP.buy ? bigOrdersBuy : bigOrdersSell
              }
            />
          }
        />
      </WrapperView>
    </Drawer>
  );
};
const styles = StyleSheet.create({
  activeTabStyle: {
    color: '#00142A',
  },
});
export default OrderInfoSheet;
