import React, {useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {TouchableWithoutFeedback, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {Button, RichLocale} from '@krn/ui';
import useTracker from 'hooks/useTracker';
import useLang from 'hooks/useLang';
import {ArrowRight} from '../../VerifyArea';
import IdentityIPFlow from 'components/KYC/Home/PI/Common/IdentityIPFlow';
import {StepDesc, PIFlowWrapper, PIFlowDesc, ErrorButtonBox} from '../style';
import {MessageBox, ImageIcon, MessageText, StrongText} from '../../style';

export default ({trackStatus, onClickVerify, kyc3Status, kyc3StatusEnum}) => {
  const {_t} = useLang();
  const navigation = useNavigation();
  const {onClickTrack} = useTracker();
  const kycClearInfo = useSelector(s => s.kyc.kycClearInfo);

  // 查看原因
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

  // 失败原因
  const msgText = useMemo(() => {
    // 待打回
    if (kyc3StatusEnum.CLEARANCE === kyc3Status) {
      return (
        <Text>
          {kycClearInfo.topMsg}
          <TouchableWithoutFeedback onPress={onCheckReason}>
            <StrongText>{_t('87a2f59d64b04000ac69')}</StrongText>
          </TouchableWithoutFeedback>
        </Text>
      );
    }
    // 已打回
    if (kyc3StatusEnum.RESET === kyc3Status) {
      return _t('kyc.callback.describe3');
    }
    return (
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
    );
  }, [kyc3StatusEnum, kyc3Status]);

  return (
    <>
      <StepDesc>{_t('5a1ff894e2854000a49c')}</StepDesc>
      <PIFlowWrapper>
        <PIFlowDesc>{_t('a251c2923cb54000a15c')}</PIFlowDesc>
        <IdentityIPFlow />

        <MessageBox bgColor="secondary8">
          <ImageIcon source={require('assets/error.png')} />
          <MessageText textColor="secondary">{msgText}</MessageText>
        </MessageBox>

        <ErrorButtonBox>
          <Button onPress={onClickVerify} afterIcon={<ArrowRight />}>
            {_t('kyc.homepage.failed.button')}
          </Button>
        </ErrorButtonBox>
      </PIFlowWrapper>
    </>
  );
};
