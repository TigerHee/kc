import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {css} from '@emotion/native';
import {exitRN} from '@krn/bridge';
import {RichLocale} from '@krn/ui';

import {EnhanceRadioType} from 'components/Common/Radio/Radio';
import {AgreementList} from 'components/copyTradeComponents/AgreementList';
import {AGREEMENT_SCENE_TYPE} from 'constants/index';
import {useDoSignAgreementMutation} from 'hooks/copyTrade/queries/useAgreementListCenter';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {
  AttentionText,
  AttentionWrap,
  CancelText,
  Container,
  Content,
  FixedBottomArea,
  StyledHeader,
  StyledRadio,
  StyledSubmitBtn,
  SuccessDesc,
  SuccessIcon,
  SuccessText,
} from './styles';

const scene = AGREEMENT_SCENE_TYPE.LEAD_TRADE;

const LeadTradeReSign = () => {
  const {_t} = useLang();
  const {onClickTrack} = useTracker();
  const [isAgree, setIsAgree] = useState(false);

  const {isSignLoading, doSignTerms} = useDoSignAgreementMutation({scene});

  const doSignAndClosePage = async () => {
    onClickTrack({
      blockId: 'button',
      locationId: 'doSign',
    });
    await doSignTerms();
    exitRN();
  };

  return (
    <Container>
      <StyledHeader />

      <Content>
        <View
          style={css`
            align-items: center;
          `}>
          <SuccessIcon imgType="success" />
        </View>
        <SuccessText>{_t('2b00e42ca5c34000ae5a')}</SuccessText>
        <SuccessDesc>{_t('301dff84b45c4000abc1')}</SuccessDesc>
      </Content>

      <FixedBottomArea>
        <AttentionWrap>
          <StyledRadio
            type={EnhanceRadioType.check}
            checked={isAgree}
            onChange={() => setIsAgree(!isAgree)}
          />

          <AttentionText>
            <RichLocale
              message={_t('1058274a0f5d4000a184')}
              renderParams={{
                DESC: {
                  component: AgreementList,
                  componentProps: {
                    scene,
                  },
                },
              }}
            />
          </AttentionText>
        </AttentionWrap>
        <StyledSubmitBtn
          onPress={doSignAndClosePage}
          size="large"
          disabled={!isAgree}
          loading={isSignLoading}>
          {_t('0fdc446220304000a749')}
        </StyledSubmitBtn>
        <TouchableOpacity activeOpacity={0.8} onPress={exitRN}>
          <CancelText>{_t('f59a79d01a754000adf0')}</CancelText>
        </TouchableOpacity>
      </FixedBottomArea>
    </Container>
  );
};

export default LeadTradeReSign;
