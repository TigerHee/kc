import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {openNative} from '@krn/bridge';
import useLang from 'hooks/useLang';
import {getNativeInfo} from 'utils/helper';
import useIconSrc from 'hooks/useIconSrc';
import {
  ImageVerified,
  VerifiedTitle,
  ArrowRightIcon,
  KybLinkBtn,
  ButtonBox,
} from '../style';
import {VerifyBox} from '../VerifyArea';
import {Button} from '@krn/ui';

const ArrowRight = () => {
  return <ArrowRightIcon source={require('assets/arrow-right.png')} />;
};

export const KybVerified = ({}) => {
  const {_t} = useLang();

  const onDeposit = () => {
    openNative('/account/deposit');
  };

  return (
    <VerifyBox key="6">
      <ImageVerified source={useIconSrc('verified')} autoRotateDisable />
      <VerifiedTitle>{_t('oogeSjyhgYVGNnRbnGb9xL')}</VerifiedTitle>
      <ButtonBox>
        <Button onPress={onDeposit} afterIcon={<ArrowRight />}>
          {_t('kyc.homepage.verified.button')}
        </Button>
      </ButtonBox>
    </VerifyBox>
  );
};

export const KybVerifying = ({}) => {
  const {_t} = useLang();

  const onPageToWebKyb = async () => {
    const {webApiHost} = await getNativeInfo();
    const url = `https://${webApiHost}/account/kyc`;
    openNative(`/link?url=${encodeURIComponent(url)}`);
  };

  return (
    <VerifyBox key="6">
      <ImageVerified source={useIconSrc('verifying')} autoRotateDisable />
      <VerifiedTitle>{_t('q1TKsDW8bQRVnUx1dVatcf')}</VerifiedTitle>
      <TouchableWithoutFeedback onPress={onPageToWebKyb}>
        <KybLinkBtn>{_t('1P6coHUKNom9XLTXMuW8iH')}</KybLinkBtn>
      </TouchableWithoutFeedback>
    </VerifyBox>
  );
};
