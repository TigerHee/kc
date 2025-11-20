import React from 'react';
import {M, ArrowRightIcon, ButtonBox} from './style';
import {VerifyBox} from './VerifyArea';
import {View} from 'react-native';
import useLang from 'hooks/useLang';
import {CommunityContent} from './Clearance';
import useIconSrc from 'hooks/useIconSrc';
import {Button} from '@krn/ui';

const ArrowRight = () => {
  return <ArrowRightIcon source={require('assets/arrow-right.png')} />;
};

export default ({onClickVerify}) => {
  const {_t} = useLang();
  return (
    <View>
      <VerifyBox>
        <M.QuestionIcon
          source={useIconSrc('suspensionWarning')}
          autoRotateDisable
        />
        <M.SubTitle>{_t('kyc.callback.describe3')}</M.SubTitle>
        <ButtonBox>
          <Button onPress={onClickVerify} afterIcon={<ArrowRight />}>
            {_t('kyc.homepage.failed.button')}
          </Button>
        </ButtonBox>
      </VerifyBox>
      <CommunityContent />
    </View>
  );
};
