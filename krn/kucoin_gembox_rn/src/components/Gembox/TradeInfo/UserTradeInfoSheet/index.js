/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useCallback, useState, useEffect} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from '@emotion/native';
import {Drawer, Button} from '@krn/ui';
import CommonTab from '../CommonTab';
import TabContent from './TabContent';
import {USER_TREADEINFO_TAB_MAP, USER_TREADEINFO_COlOR_MAP} from '../config';
import useLang from 'hooks/useLang';

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
const BtnWrapper = styled.View`
  width: 100%;
  padding: 12px 16px;
`;
const CancelBtn = styled(Button)`
  height: 40px;
  background: rgba(0, 20, 42, 0.04);
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
  font-size: 14px;
  color: rgba(0, 20, 42, 0.4);
`;
const TabBtnImage = styled.Image`
  width: 32px;
  height: 32px;
`;
const TabBtn = props => {
  const {onChangeTab, activeTab, activeName, text, logo} = props;
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => onChangeTab(activeName)}>
      <TabBtnView>
        <TabBtnImage source={logo} />
        <TabBtnText
          style={activeTab === activeName ? styles.activeTabStyle : null}>
          {text}
        </TabBtnText>
        {activeTab === activeName && <ActiveBar />}
      </TabBtnView>
    </TouchableOpacity>
  );
};
const UserTradeInfoSheet = props => {
  const {_t} = useLang();
  const {defaultActiveTab} = props;
  const {openUserTradeInfoSheet} = useSelector(state => state.gembox) || {};
  const [activeTab, setActiveTab] = useState(USER_TREADEINFO_TAB_MAP.BIG_MONEY);
  const dispatch = useDispatch();
  const onChangeTab = useCallback(val => {
    setActiveTab(val);
  }, []);
  useEffect(() => {
    if (openUserTradeInfoSheet) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab, openUserTradeInfoSheet]);
  const onClose = useCallback(() => {
    dispatch({
      type: 'gembox/update',
      payload: {
        openUserTradeInfoSheet: false,
      },
    });
  }, [dispatch]);
  return (
    <Drawer
      id="user-drawer"
      show={openUserTradeInfoSheet}
      onClose={onClose}
      leftSlot={<Blank />}
      header={<Blank />}>
      <WrapperView>
        <CommonTab
          tabLeft={
            <TabBtn
              onChangeTab={onChangeTab}
              activeTab={activeTab}
              activeName={USER_TREADEINFO_TAB_MAP.BIG_MONEY}
              text={_t('wdM4rpM3K1y7PLc9Ks9XFX')}
              logo={require('assets/gembox/OrangeShadow.png')}
            />
          }
          tabRight={
            <TabBtn
              onChangeTab={onChangeTab}
              activeTab={activeTab}
              activeName={USER_TREADEINFO_TAB_MAP.PRO_TRADER}
              text={_t('dN7n5wXika1ZjXTKSr6WNR')}
              logo={require('assets/gembox/BlueShadow.png')}
            />
          }
          content={
            <TabContent
              activeTab={activeTab}
              typeColor={
                activeTab === USER_TREADEINFO_TAB_MAP.BIG_MONEY
                  ? USER_TREADEINFO_COlOR_MAP.BIG_MONEY
                  : USER_TREADEINFO_COlOR_MAP.PRO_TRADER
              }
            />
          }
        />
        <BtnWrapper>
          <CancelBtn
            size="large"
            onPress={onClose}
            textStyle={{
              fontWeight: 'bold',
              fontSize: 16,
              color: '#000000',
            }}>
            {_t('6AsB4WnsBUdAXqD9AxvXTM')}
          </CancelBtn>
        </BtnWrapper>
      </WrapperView>
    </Drawer>
  );
};
const styles = StyleSheet.create({
  activeTabStyle: {
    color: '#00142A',
  },
});
export default UserTradeInfoSheet;
