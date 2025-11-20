import React, {useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {TouchableWithoutFeedback} from 'react-native';
import {Button, RichLocale} from '@krn/ui';
import useLang from 'hooks/useLang';
import {ArrowRight} from '../../VerifyArea';
import IdentityIPFlow from 'components/KYC/Home/PI/Common/IdentityIPFlow';
import {StepDesc, PIFlowWrapper, PIFlowDesc, ErrorButtonBox} from '../style';
import {MessageBox, ImageIcon, MessageText, StrongText} from '../../style';

export default ({onPIVerify}) => {
  const {_t} = useLang();
  const navigation = useNavigation();

  // 查看原因
  const onCheckReason = () => {
    navigation.push('KYCReasonPage');
  };

  // 失败原因
  const msgText = useMemo(() => {
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
  }, []);

  return (
    <>
      <StepDesc>{_t('f4ad443067954000a54a')}</StepDesc>
      <PIFlowWrapper>
        <PIFlowDesc>{_t('a251c2923cb54000a15c')}</PIFlowDesc>
        <IdentityIPFlow type="PI" />

        <MessageBox bgColor="secondary8">
          <ImageIcon source={require('assets/error.png')} />
          <MessageText textColor="secondary">{msgText}</MessageText>
        </MessageBox>

        <ErrorButtonBox>
          <Button onPress={onPIVerify} afterIcon={<ArrowRight />}>
            {_t('kyc.homepage.failed.button')}
          </Button>
        </ErrorButtonBox>
      </PIFlowWrapper>
    </>
  );
};
