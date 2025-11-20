import useIconSrc from 'hooks/useIconSrc';
import useLang from 'hooks/useLang';
import React from 'react';
import {View} from 'react-native';
import {Button} from '@krn/ui';
import {
  ImageVerified,
  PrivacyImg,
  PrivacyText,
  PrivacyWrapper,
  SecurityIcon,
  SubTitle,
  Title,
  VerifiedTag,
  VerifiedTagText,
  VerifiedTitle,
  VerifyBoxTop,
  VerifyBoxWrapper,
  BtnBox,
} from './style';
import {Privacy, ArrowRight, MessageWarnning, MessageError} from './VerifyArea';
import OutlinedButton from 'components/Common/OutlinedButton';

const AdvanceWaitTip = () => {
  const {_t} = useLang();
  return (
    <PrivacyWrapper>
      <PrivacyImg source={useIconSrc('info')} />
      <PrivacyText>{_t('a8f4d9dc26984000a053')}</PrivacyText>
    </PrivacyWrapper>
  );
};

const VerifyBox = ({
  children,
  isBaseVerified = true,
  hidePrivacy,
  ...otherProps
}) => {
  return (
    <VerifyBoxWrapper hidePrivacy={hidePrivacy} {...otherProps}>
      <VerifyBoxTop>{children}</VerifyBoxTop>
      {hidePrivacy ? null : (
        <>{isBaseVerified ? <Privacy /> : <AdvanceWaitTip />}</>
      )}
    </VerifyBoxWrapper>
  );
};

// 未认证
export const AdvanceUnverified = ({
  onStartAdvance,
  isBaseVerified,
  isBtnLoading,
}) => {
  const {_t} = useLang();
  return (
    <VerifyBox isBaseVerified={isBaseVerified}>
      <Title>{_t('d433f7cc73be4000a22c')}</Title>
      <View>
        <SubTitle>{_t('c35d567b01304000a938')}</SubTitle>
      </View>
      {isBaseVerified ? (
        <BtnBox>
          <Button
            onPress={onStartAdvance}
            disabled={isBtnLoading}
            loading={{
              spin: isBtnLoading,
              color: '#fff',
              size: 'small',
            }}
            afterIcon={<ArrowRight />}>
            {_t('kyc.homepage.describe.button')}
          </Button>
        </BtnBox>
      ) : null}
    </VerifyBox>
  );
};

// 认证中
export const AdvanceVerifying = () => {
  const {_t} = useLang();

  return (
    <VerifyBox key="3">
      <Title>{_t('d433f7cc73be4000a22c')}</Title>
      <SubTitle>{_t('c35d567b01304000a938')}</SubTitle>
      <></>
      <MessageWarnning>{_t('8d551e18f2624000adb8')}</MessageWarnning>
    </VerifyBox>
  );
};

// 认证失败
export const AdvanceRejected = ({onStartAdvance, failReason, isBtnLoading}) => {
  const {_t} = useLang();
  return (
    <VerifyBox key="4">
      <Title>{_t('d433f7cc73be4000a22c')}</Title>
      <View>
        <SubTitle>{_t('c35d567b01304000a938')}</SubTitle>
      </View>
      <MessageError failReason={failReason} onClickVerify={onStartAdvance} />
      <BtnBox>
        <Button
          onPress={onStartAdvance}
          disabled={isBtnLoading}
          loading={{
            spin: isBtnLoading,
            color: '#fff',
            size: 'small',
          }}
          afterIcon={<ArrowRight />}>
          {_t('kyc.homepage.failed.button')}
        </Button>
      </BtnBox>
    </VerifyBox>
  );
};

// 成功
export const AdvanceVerified = ({onStartAdvance}) => {
  const {_t} = useLang();

  return (
    <VerifyBox key="6" hidePrivacy>
      <ImageVerified source={useIconSrc('verified')} autoRotateDisable />
      <VerifiedTag>
        <SecurityIcon
          source={require('assets/security.png')}
          autoRotateDisable
        />
        <VerifiedTagText>{_t('4a730c3346164000a241')}</VerifiedTagText>
      </VerifiedTag>
      <VerifiedTitle>{_t('ef13116224f94000a6a9')}</VerifiedTitle>
      <OutlinedButton
        onPress={onStartAdvance}
        outerStyle={{
          width: '100%',
        }}>
        {_t('6b12f8328eb24000a597')}
      </OutlinedButton>
    </VerifyBox>
  );
};
