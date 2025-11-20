/**
 * Owner: willen@kupotech.com
 */
import React, {useEffect} from 'react';
import styled from '@emotion/native';
import noticeImg from 'assets/convert/notice.png';
import arrowImg from 'assets/convert/arrow_right.png';
import {useDispatch, useSelector} from 'react-redux';
import {TouchableWithoutFeedback} from 'react-native';
import {openNative} from '@krn/bridge';
import RestrictNotice from 'components/Convert/FormInput/RestrictNotice';
import ScrollingText from 'components/Common/ScrollingText';
import {useTheme} from '@krn/ui';

const NoticeWrapper = styled.View`
  background: ${({theme}) => theme.colorV2.complementary4};
  flex-direction: row;
  align-items: center;
  padding: 0 12px;
  height: 40px;
  margin-bottom: 12px;
`;
const Icon = styled.Image`
  width: 16px;
  height: 16px;
`;

const ScrollingTextView = styled.View`
  flex: 1;
  overflow: hidden;
  margin: 0 4px;
`;

const Content = styled.Text`
  margin: 0 4px;
  flex: 1;
  flex-direction: row;
  overflow: hidden;
  align-items: center;
`;

const Arrow = styled.Image`
  width: 12px;
  height: 12px;
`;

const Notice = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const dismissInfo = useSelector(s => s.dismiss.dismissInfo);
  const baseConfig = useSelector(state => state.convert.baseConfig);
  const dismissLoading = useSelector(
    state => state.loading.effects['dismiss/getIpDismiss'],
  );
  const isLogin = useSelector(state => state.app.isLogin);

  const openLink = () => {
    if (baseConfig?.url) {
      openNative(`/link?url=${baseConfig.url}`);
    }
  };

  useEffect(() => {
    // 有登录结果再请求顶飘（ip封禁顶飘登录与未登录返回结果不一样，所以等登录结果回来再发出请求）
    if (isLogin !== null) {
      dispatch({
        type: 'dismiss/getIpDismiss',
        payload: {
          bizType: 'FORCE_KYC_MESSAGE,CLEARANCE_MESSAGE',
        },
      });
    }
  }, [isLogin]);

  // 红色订票
  return dismissInfo?.dismiss ? (
    <RestrictNotice
      bizType={dismissInfo?.bizType}
      notice={dismissInfo?.notice}
    />
  ) : baseConfig?.message && !dismissLoading ? ( // 黄色订票
    <TouchableWithoutFeedback onPress={openLink}>
      <NoticeWrapper>
        <Icon source={noticeImg} autoRotateDisable />
        <ScrollingTextView>
          {baseConfig.message?.length > 30 ? (
            <ScrollingText
              speed={30}
              textStyle={{
                fontSize: 14,
                color: theme.colorV2.text60,
              }}>
              {baseConfig.message}
            </ScrollingText>
          ) : (
            <Content numberOfLines={1} ellipsizeMode="clip">
              {baseConfig.message}
            </Content>
          )}
        </ScrollingTextView>
        {baseConfig?.url ? <Arrow source={arrowImg} /> : null}
      </NoticeWrapper>
    </TouchableWithoutFeedback>
  ) : null;
};

export default Notice;
