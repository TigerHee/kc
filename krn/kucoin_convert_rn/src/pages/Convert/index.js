/**
 * Owner: willen@kupotech.com
 */
import {showToast} from '@krn/bridge';
import React, {useEffect, useState} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import styled from '@emotion/native';
import Convert from 'components/Convert';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import useLang from 'hooks/useLang';
import {useFocusEffect} from '@react-navigation/native';

import faqDark from 'assets/convert/faq_dark.png';
import faqLight from 'assets/convert/faq_light.png';
import historyDark from 'assets/convert/history_dark.png';
import historyLight from 'assets/convert/history_light.png';

import useTracker from 'hooks/useTracker';
import useIsSymbolDisabled from 'hooks/useIsSymbolDisabled';
import HeaderPro from 'components/Common/HeaderPro';
import ThemeImage from 'components/Common/ThemeImage';
import withAuth from 'hooks/withAuth';
import useDisableTextInput from 'hooks/useDisableTextInput';
import UpdateVersionPage from 'pages/UpdateVersion';

const AuthTouchableWithoutFeedback = withAuth(TouchableWithoutFeedback);

const ConvertView = styled.SafeAreaView`
  flex: 1;
  background: ${({theme}) => theme.colorV2.overlay};
`;

const HistoryImg = styled(ThemeImage)`
  width: 20px;
  height: 20px;
`;

const FAQImg = styled(ThemeImage)`
  width: 20px;
  height: 20px;
  margin-right: 16px;
`;

const RightSlot = styled.View`
  flex-direction: row;
`;

// 交易对禁用的提示信息
const SymbolDisabledMessage = React.memo(() => {
  const {_t} = useLang();
  const isSymbolDisabled = useIsSymbolDisabled();

  if (isSymbolDisabled) {
    showToast(_t('05cfc59438414000acf6'));
  }
  return null;
});

const ConvertPage = ({route}) => {
  const {_t} = useLang();

  const networkUnavailable = useSelector(state => state.app.networkUnavailable);
  const baseConfig = useSelector(state => state.convert.baseConfig);
  const isLogin = useSelector(state => state.app.isLogin);

  const [step, setStep] = useState(1);
  const shoudleDisableTextInput = useDisableTextInput();
  const params = route?.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {onPageExpose, onClickTrack, onExpose} = useTracker();

  useEffect(() => {
    if (params?.step) {
      setStep(params?.step);
    }
  }, [params]);

  const handleHistoryPress = () => {
    try {
      onClickTrack({blockId: 'orderPromptNew', locationId: 1});
    } catch (e) {}

    dispatch({type: 'order/reset', payload: {clearList: true}});
    navigation.push('ConvertHistoryPage');
  };

  useFocusEffect(
    React.useCallback(() => {
      //订单按钮曝光
      onExpose({blockId: 'orderPromptNew', locationId: 1});
      //页面曝光埋点
      onPageExpose();
    }, []),
  );

  // 当网络不可用时，跳到错误页
  useEffect(() => {
    if (networkUnavailable) navigation.replace('ErrorPage');
  }, [networkUnavailable]);

  /**
   * 因为首页用到了 TextInput，所以特定的 android 版本强制引导去升级
   */
  return shoudleDisableTextInput ? (
    <UpdateVersionPage />
  ) : (
    <ConvertView>
      <HeaderPro
        title={_t('vg11ZZcHj7ibvTtuocxpQ')}
        rightSlot={
          baseConfig?.downtime ? null : (
            <RightSlot>
              <TouchableWithoutFeedback
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                onPress={() => {
                  navigation.push('ConvertFAQPage');
                }}>
                <FAQImg
                  darkSrc={faqDark}
                  lightSrc={faqLight}
                  autoRotateDisable
                />
              </TouchableWithoutFeedback>
              <AuthTouchableWithoutFeedback
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                onPress={handleHistoryPress}>
                <HistoryImg
                  darkSrc={historyDark}
                  lightSrc={historyLight}
                  autoRotateDisable
                />
              </AuthTouchableWithoutFeedback>
            </RightSlot>
          )
        }
      />
      <Convert params={params} step={step} setStep={setStep} />
      {Boolean(isLogin) && <SymbolDisabledMessage />}
    </ConvertView>
  );
};
export default ConvertPage;
