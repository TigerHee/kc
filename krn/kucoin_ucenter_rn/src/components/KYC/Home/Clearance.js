import React, {useState} from 'react';
import {openNative} from '@krn/bridge';
import {M, ArrowRightIcon, ButtonBox} from './style';
import {VerifyBox} from './VerifyArea';
import {View, TouchableWithoutFeedback, Platform} from 'react-native';
import Dialog from './Dialog';
import {useSelector} from 'react-redux';
import useLang from 'hooks/useLang';
import {RichLocale, Button} from '@krn/ui';
import {jumpCommunity} from './config';
import moment from 'moment';
import useTracker from 'hooks/useTracker';
import {compareVersion, getNativeInfo} from 'utils/helper';
import useIconSrc from 'hooks/useIconSrc';

// 支持打回的版本
const SUPPORT_CLEAR_VERSION = '3.98.1';

const ArrowRight = () => {
  return <ArrowRightIcon source={require('assets/arrow-right.png')} />;
};

export const CommunityContent = () => {
  const {_t} = useLang();
  const {onClickTrack} = useTracker();
  const joinTelegram = () => {
    onClickTrack({
      blockId: 'JoinGroup',
      locationId: '1',
    });
    jumpCommunity();
  };
  return (
    <M.CommunityDes>
      <RichLocale
        message={_t('6622b8b9c4294000a2d9')}
        renderParams={{
          COMMUNITY: {
            component: ({children}) => (
              <TouchableWithoutFeedback onPress={joinTelegram}>
                <M.CommunityDesLink>{children}</M.CommunityDesLink>
              </TouchableWithoutFeedback>
            ),
            componentProps: {},
          },
        }}
      />
    </M.CommunityDes>
  );
};
export default ({onClickVerify}) => {
  const {_t} = useLang();
  const kycClearInfo = useSelector(state => state.kyc.kycClearInfo);
  const [visible, setShow] = useState(false);

  const onRestart = async () => {
    const {version} = await getNativeInfo();
    if (compareVersion(version, SUPPORT_CLEAR_VERSION) < 0) {
      setShow(true);
    } else {
      onClickVerify();
    }
  };

  const close = () => {
    setShow(false);
  };

  const onConfirm = async () => {
    try {
      const isIOS = Platform.OS === 'ios';

      // market://details?id=com.kubi.kucoin

      const url = isIOS
        ? 'itms-apps://itunes.apple.com/app/id1378956601'
        : 'https://kucoin-android.onelink.me/xTQQ/909khuy9';

      openNative(`/external/link?url=${encodeURIComponent(url)}`);
    } catch (error) {
      console.log('error === ', error);
    }
  };

  // 打回倒计时
  const diffDays = moment(kycClearInfo.clearAt || Date.now()).diff(
    moment(),
    'days',
  );

  //计算打回结束时间 - 当前时间 >= 1年
  const isOverOneYear =
    moment.duration(moment(kycClearInfo.clearAt).diff(moment())).asYears() >= 1;

  return (
    <View>
      <VerifyBox>
        <M.QuestionIcon
          source={useIconSrc('suspensionError')}
          autoRotateDisable
        />
        <M.Title>{_t('kyc.callback.subtitle')}</M.Title>
        {isOverOneYear ? (
          <M.SubTitle>{_t('262ee07aefe84000a800')}</M.SubTitle>
        ) : (
          <M.SubTitle>
            <RichLocale
              message={_t('kyc.callback.describe1', {num: diffDays})}
              renderParams={{
                DATE: {
                  component: ({children}) => (
                    <M.SubTitle textColor="text">{children}</M.SubTitle>
                  ),
                  componentProps: {},
                },
              }}
            />
          </M.SubTitle>
        )}

        <ButtonBox>
          <Button onPress={onRestart} afterIcon={<ArrowRight />}>
            {_t('kyc.homepage.failed.button')}
          </Button>
        </ButtonBox>
      </VerifyBox>
      <CommunityContent />

      <Dialog
        visible={visible}
        title={_t('41f4rT5DQmXzgigRwM4Csb')}
        content={_t('f8bc6cd5db9e4000a27c')}
        okText={_t('d8XhWuwEhe4rsXs26XYksJ')}
        onCancel={close}
        onConfirm={onConfirm}
      />
    </View>
  );
};
