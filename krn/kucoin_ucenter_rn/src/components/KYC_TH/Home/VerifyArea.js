import {Button, Drawer, RichLocale, Confirm} from '@krn/ui';
import {openNative} from '@krn/bridge';
import useIconSrc from 'hooks/useIconSrc';
import useLang from 'hooks/useLang';
import React, {useState} from 'react';
import {TouchableWithoutFeedback, View, Platform} from 'react-native';
import {compareVersion, getNativeInfo} from 'utils/helper';
import {
  ArrowRightIcon,
  FailReasonScrollView,
  FailReasonText,
  ImageIcon,
  ImageVerified,
  ImageVerifying,
  MButton,
  MButtonText,
  MessageBox,
  MessageText,
  PrivacyImg,
  PrivacyText,
  PrivacyWrapper,
  SecurityIcon,
  StrongText,
  SubTitle,
  Title,
  VerifiedTag,
  VerifiedTagText,
  VerifyBoxTop,
  VerifyBoxWrapper,
} from './style';

const Privacy = () => {
  const {_t} = useLang();

  return (
    <PrivacyWrapper>
      <PrivacyImg source={useIconSrc('privacy')} />
      <PrivacyText>{_t('56989bde53f04000a4c9')}</PrivacyText>
    </PrivacyWrapper>
  );
};

const VerifyBox = ({children, hidePrivacy, ...otherProps}) => {
  return (
    <VerifyBoxWrapper hidePrivacy={hidePrivacy} {...otherProps}>
      <VerifyBoxTop>{children}</VerifyBoxTop>
      {hidePrivacy ? null : <Privacy />}
    </VerifyBoxWrapper>
  );
};

const ArrowRight = () => {
  return <ArrowRightIcon source={require('assets/arrow-right.png')} />;
};

const MessageWarnning = ({children}) => {
  if (!children) return null;
  return (
    <MessageBox bgColor="complementary8">
      <ImageIcon source={require('assets/warnning.png')} />
      <MessageText textColor="complementary">{children}</MessageText>
    </MessageBox>
  );
};

const MessageError = ({failReason = [], onClickVerify}) => {
  const {_t} = useLang();
  const [show, setShow] = useState(false);
  const onCheckReason = () => {
    setShow(true);
  };

  const targetFailReason =
    failReason && failReason.length > 0
      ? failReason
      : [_t('compliance.meta.audit.reject')];

  return (
    <MessageBox bgColor="secondary8">
      <ImageIcon source={require('assets/error.png')} />
      <MessageText textColor="secondary">
        <RichLocale
          message={_t('kyc.homepage.describe.failed')}
          renderParams={{
            LINK: {
              component: ({children}) => (
                <TouchableWithoutFeedback onPress={onCheckReason}>
                  <StrongText>{children}</StrongText>
                </TouchableWithoutFeedback>
              ),
              componentProps: {},
            },
          }}
        />
      </MessageText>
      <Drawer
        title={_t('f03feb607f144000a2a6')}
        headerType="native"
        show={show}
        onClose={() => setShow(false)}>
        <FailReasonScrollView>
          {targetFailReason.map((item, index) => (
            <View key={index}>
              <FailReasonText>{item}</FailReasonText>
            </View>
          ))}
          <Button
            onPress={() => {
              setShow(false);
              onClickVerify();
            }}
            style={{marginTop: 58}}>
            {_t('kyc.homepage.failed.button')}
          </Button>
        </FailReasonScrollView>
      </Drawer>
    </MessageBox>
  );
};

// 支持 NFC 的版本号
const SUPPORT_NFC_VERSION = '3.132.0';
const Unverified = ({onClickVerify}) => {
  const {_t} = useLang();
  const [show, setShow] = useState(false);

  const onHandleClick = async () => {
    const {version} = await getNativeInfo();
    if (compareVersion(version, SUPPORT_NFC_VERSION) < 0) {
      setShow(true);
    } else {
      onClickVerify();
    }
  };

  const onDownload = async () => {
    try {
      const isIOS = Platform.OS === 'ios';
      const url = isIOS
        ? 'https://kucointh.onelink.me/AiYm/3sry39qx'
        : 'https://kucointh.onelink.me/AiYm/0a9yzxe6';

      openNative(`/external/link?url=${encodeURIComponent(url)}`);
    } catch (error) {
      console.log('error === ', error);
    }
  };

  return (
    <VerifyBox key="2">
      <ImageVerifying source={useIconSrc('verifying')} autoRotateDisable />
      <Title>{_t('kyc.homepage.subtitle')}</Title>
      <MButton onPress={onHandleClick}>
        <MButtonText>{_t('kyc.homepage.describe.button')}</MButtonText>
        <ArrowRight />
      </MButton>

      <Confirm
        show={show}
        title={_t('41f4rT5DQmXzgigRwM4Csb')}
        message={_t('f8bc6cd5db9e4000a27c')}
        confirmText={_t('d8XhWuwEhe4rsXs26XYksJ')}
        onConfirm={onDownload}
        onClose={() => setShow(false)}
        showCloseX
      />
    </VerifyBox>
  );
};

const Verifying = ({isKyb}) => {
  const {_t} = useLang();
  return (
    <VerifyBox key="3">
      <ImageVerifying source={useIconSrc('verifying')} autoRotateDisable />
      {isKyb ? (
        <Title>{_t('06df43ea9c364000a398')}</Title>
      ) : (
        <>
          <Title>{_t('kyc.homepage.subtitle')}</Title>
          <MessageWarnning>
            {_t('kyc.homepage.describe.verifying')}
          </MessageWarnning>
        </>
      )}
    </VerifyBox>
  );
};

const Rejected = ({onClickVerify, failReason, isKyb}) => {
  const {_t} = useLang();
  return (
    <VerifyBox key="4">
      <ImageVerifying source={useIconSrc('verifying')} autoRotateDisable />
      {isKyb ? (
        <Title>{_t('06df43ea9c364000a398')}</Title>
      ) : (
        <Title>{_t('kyc.homepage.subtitle')}</Title>
      )}
      <MessageError failReason={failReason} onClickVerify={onClickVerify} />
      <MButton onPress={onClickVerify}>
        <MButtonText>{_t('kyc.homepage.failed.button')}</MButtonText>
        <ArrowRight />
      </MButton>
    </VerifyBox>
  );
};

const Verified = () => {
  const {_t} = useLang();

  return (
    <VerifyBox key="6" hidePrivacy>
      <ImageVerified source={useIconSrc('verified')} autoRotateDisable />
      <VerifiedTag>
        <SecurityIcon
          source={require('assets/security.png')}
          autoRotateDisable
        />
        <VerifiedTagText>{_t('211a998551d94000a138')}</VerifiedTagText>
      </VerifiedTag>
    </VerifyBox>
  );
};

export {
  Privacy,
  VerifyBox,
  ArrowRight,
  MessageWarnning,
  Rejected,
  Unverified,
  Verified,
  Verifying,
  MessageError,
};
