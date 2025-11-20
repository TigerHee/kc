import React, {useMemo} from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {openNative} from '@krn/bridge';
import useLang from 'hooks/useLang';
import {RichLocale, Button} from '@krn/ui';
import {useSelector} from 'react-redux';
import useTracker from 'hooks/useTracker';
import useIconSrc from 'hooks/useIconSrc';
import {
  MessageBox,
  ImageIcon,
  MessageText,
  StrongText,
  VerifyBoxWrapper,
  VerifyBoxTop,
  ImageVerifying,
  Title,
  SubTitle,
  VerifiedTag,
  SecurityIcon,
  VerifiedTagText,
  ImageVerified,
  VerifiedTitle,
  HighlightText,
  ArrowRightIcon,
  PrivacyWrapper,
  PrivacyImg,
  PrivacyText,
  ButtonBox,
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

const VerifyBox = ({children, ...otherProps}) => {
  return (
    <VerifyBoxWrapper {...otherProps}>
      <VerifyBoxTop>{children}</VerifyBoxTop>
      <Privacy />
    </VerifyBoxWrapper>
  );
};

export const ArrowRight = () => {
  return <ArrowRightIcon source={require('assets/arrow-right.png')} />;
};

export const MessageWarning = ({children}) => {
  if (!children) return null;
  return (
    <MessageBox bgColor="complementary8">
      <ImageIcon source={require('assets/warnning.png')} />
      <MessageText textColor="complementary">{children}</MessageText>
    </MessageBox>
  );
};

export const MessageError = ({trackStatus}) => {
  const navigation = useNavigation();
  const {_t} = useLang();
  const {onClickTrack} = useTracker();
  const onCheckReason = () => {
    onClickTrack({
      blockId: 'FailReason',
      locationId: '1',
      properties: {
        kyc_homepage_status: trackStatus,
      },
    });
    navigation.push('KYCReasonPage');
  };
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
    </MessageBox>
  );
};

const RewardMessage = React.memo(({fake}) => {
  const {_t} = useLang();
  const rewardInfo = useSelector(state => state.kyc.rewardInfo);
  if (
    ['KYC', 'OLD_KYC'].includes(rewardInfo.taskType) &&
    !fake &&
    rewardInfo.taskSubTitle
  ) {
    return (
      <SubTitle>
        <RichLocale
          message={rewardInfo.taskSubTitle}
          renderParams={{
            SPAN: {
              component: HighlightText,
              componentProps: {},
            },
          }}
        />
      </SubTitle>
    );
  }
  return <SubTitle>{_t('kyc.homepage.describe2.unverified')}</SubTitle>;
});

const Unverified = ({onClickVerify}) => {
  const {_t} = useLang();
  return (
    <VerifyBox key="2">
      <ImageVerifying source={useIconSrc('verifying')} autoRotateDisable />
      <Title>{_t('kyc.homepage.subtitle')}</Title>
      <View>
        <SubTitle>{_t('kyc.homepage.describe.unverified')}</SubTitle>
      </View>
      <RewardMessage />
      <ButtonBox>
        <Button onPress={onClickVerify} afterIcon={<ArrowRight />}>
          {_t('kyc.homepage.describe.button')}
        </Button>
      </ButtonBox>
    </VerifyBox>
  );
};

const Verifying = ({fake}) => {
  const {verifyType, regionCode} = useSelector(s => s.kyc.kycInfo);
  const {_t} = useLang();
  // 是否马来
  const isMY = useMemo(() => regionCode === 'MY', [regionCode]);

  return (
    <VerifyBox key="3">
      <ImageVerifying source={useIconSrc('verifying')} autoRotateDisable />
      <Title>{_t('kyc.homepage.subtitle')}</Title>
      <RewardMessage fake={fake} />
      <MessageWarning>
        {_t(
          fake
            ? isMY
              ? '01d3679db2fc4800abbb'
              : 'qMtT86sT5eodpqQEM6Wn49'
            : Number(verifyType) === 0
            ? 'kyc.app.verifying.manual'
            : 'kyc.homepage.describe.verifying',
        )}
      </MessageWarning>
    </VerifyBox>
  );
};

const Rejected = ({onClickVerify, trackStatus}) => {
  const {_t} = useLang();
  return (
    <VerifyBox key="4">
      <ImageVerifying source={useIconSrc('verifying')} autoRotateDisable />
      <Title>{_t('kyc.homepage.subtitle')}</Title>
      <View>
        <SubTitle>{_t('kyc.homepage.describe.unverified')}</SubTitle>
      </View>
      <RewardMessage />
      <MessageError trackStatus={trackStatus} />
      <ButtonBox>
        <Button onPress={onClickVerify} afterIcon={<ArrowRight />}>
          {_t('kyc.homepage.failed.button')}
        </Button>
      </ButtonBox>
    </VerifyBox>
  );
};

const Suspend = ({onClickVerify}) => {
  const {_t} = useLang();
  return (
    <VerifyBox key="5">
      <ImageVerifying source={useIconSrc('verifying')} autoRotateDisable />
      <Title>{_t('kyc.homepage.subtitle')}</Title>
      <View>
        <SubTitle>{_t('kyc.homepage.describe.unverified')}</SubTitle>
      </View>
      <RewardMessage />
      <MessageWarning>{_t('kyc.homepage.continue1')}</MessageWarning>
      <ButtonBox>
        <Button onPress={onClickVerify} afterIcon={<ArrowRight />}>
          {_t('ty26XF4NvNAw8dfRyuSMu7')}
        </Button>
      </ButtonBox>
    </VerifyBox>
  );
};

const Verified = ({trackStatus}) => {
  const {_t} = useLang();
  const {onClickTrack} = useTracker();
  const rewardInfo = useSelector(state => state.kyc.rewardInfo);
  const recharged = useSelector(state => state.kyc.recharged);

  let text = _t('kyc.homepage.verified.default');
  if (recharged === false && rewardInfo.taskType === 'DEPOSIT') {
    text = (
      <RichLocale
        message={rewardInfo.taskSubTitle}
        renderParams={{
          SPAN: {
            component: HighlightText,
            componentProps: {},
          },
        }}
      />
    );
  }
  const onDeposit = () => {
    onClickTrack({
      blockId: 'Deposit',
      locationId: '1',
      properties: {
        kyc_homepage_status: trackStatus,
        after_page_id: 'B1depositCoinList',
        norm_version: '1',
      },
    });
    openNative('/account/deposit');
  };
  return (
    <VerifyBox key="6">
      <ImageVerified source={useIconSrc('verified')} autoRotateDisable />
      <VerifiedTag>
        <SecurityIcon
          source={require('assets/security.png')}
          autoRotateDisable
        />
        <VerifiedTagText>{_t('kyc.limits.title3')}</VerifiedTagText>
      </VerifiedTag>
      <VerifiedTitle>{_t('30edc29a01084000a0a9')}</VerifiedTitle>
      <SubTitle>{text}</SubTitle>
      <ButtonBox>
        <Button onPress={onDeposit} afterIcon={<ArrowRight />}>
          {_t('kyc.homepage.verified.button')}
        </Button>
      </ButtonBox>
    </VerifyBox>
  );
};

export {Unverified, Verifying, Rejected, Suspend, Verified, Privacy, VerifyBox};
