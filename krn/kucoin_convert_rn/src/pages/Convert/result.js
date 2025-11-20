/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import styled from '@emotion/native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import useLang from 'hooks/useLang';
import historyDark from 'assets/convert/history_dark.png';
import historyLight from 'assets/convert/history_light.png';
import Result from 'components/Convert/Result';
import {useFocusEffect} from '@react-navigation/native';
import useDisableSystemBack from 'hooks/useDisableSystemBack';
import useTracker from 'hooks/useTracker';
import HeaderPro from 'components/Common/HeaderPro';
import ThemeImage from 'components/Common/ThemeImage';

const ConvertView = styled.SafeAreaView`
  flex: 1;
  background: ${({theme}) => theme.colorV2.overlay};
`;

const HistoryImg = styled(ThemeImage)`
  width: 20px;
  height: 20px;
`;

const RightSlot = styled.View`
  flex-direction: row-reverse;
`;

const ConvertResultPage = ({route}) => {
  const {_t} = useLang();
  const {onPageExpose, onClickTrack} = useTracker();

  const loading = useSelector(
    state => state.loading.effects['convert/confirmOrder'],
  );

  const params = route?.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  useDisableSystemBack();

  const goToOrder = () => {
    try {
      onClickTrack({blockId: 'orderPromptNew', locationId: 1});
    } catch (e) {}
    if (loading) return;
    dispatch({type: 'convert/resetFormData'});
    dispatch({type: 'order/reset', payload: {clearList: true}});
    navigation.replace('ConvertHistoryPage');
  };

  const resetToStep1 = () => {
    if (loading) return;
    dispatch({type: 'convert/resetFormData'});
    navigation.navigate('ConvertPage', {step: 1});
  };
  useFocusEffect(
    React.useCallback(() => {
      //页面曝光埋点
      onPageExpose();
    }, []),
  );
  return (
    <ConvertView>
      <HeaderPro
        onPressBack={() => {
          onClickTrack({
            blockId: 'convertResultNew',
            locationId: 3,
          });
          resetToStep1();
        }}
        title={_t('vg11ZZcHj7ibvTtuocxpQ')}
        rightSlot={
          <RightSlot>
            <TouchableWithoutFeedback onPress={goToOrder}>
              <HistoryImg
                darkSrc={historyDark}
                lightSrc={historyLight}
                autoRotateDisable
              />
            </TouchableWithoutFeedback>
          </RightSlot>
        }
      />
      <Result
        goToOrder={goToOrder}
        params={params}
        resetToStep1={resetToStep1}
      />
    </ConvertView>
  );
};
export default ConvertResultPage;
