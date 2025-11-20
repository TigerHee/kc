import React, {memo, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {css} from '@emotion/native';
import {RichLocale, useTheme} from '@krn/ui';

import Button from 'components/Common/Button';
import Form from 'components/Common/Form';
import Header from 'components/Common/Header';
import Radio from 'components/Common/Radio';
import {EnhanceRadioType} from 'components/Common/Radio/Radio';
import {WarnIcon} from 'components/Common/SvgIcon';
import {AgreementList} from 'components/copyTradeComponents/AgreementList';
import {AGREEMENT_SCENE_TYPE} from 'constants/index';
import {MaxLengthMap} from 'constants/public-form-field';
import {commonStyles} from 'constants/styles';
import useGoBack from 'hooks/useGoBack';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {GroupAccountType} from '../constants';
import SelectAvatar from './components/SelectAvatar';
import {useClick} from './hooks/useClick';
import {useInitForm} from './hooks/useInitForm';
import {
  AttentionText,
  AttentionWrap,
  FillApplicationPage,
  FillBanner,
  FillFormTitle,
  RadioText,
  StyledFormField,
  StyledInputField,
  StyledRadio,
  TipIconWrap,
  TipText,
} from './styles';

// const GuideLink = props => {
//   const onPress = () => openH5Link(H5Links.applyTraderAgreement);
//   return (
//     <TouchableWithoutFeedback onPress={onPress}>
//       <GuideLinkText {...props} />
//     </TouchableWithoutFeedback>
//   );
// };

const FillApplyTraderForm = () => {
  const formMethods = useInitForm();
  const {handleSubmit} = formMethods;
  const [isAgree, setIsAgree] = useState(false);
  const {_t} = useLang();
  const {colorV2} = useTheme();

  const {isSubmitLoading, receiveFormSubmit, isPullAgreementLoading} = useClick(
    {isAgree},
  );
  const {onClickTrack} = useTracker();
  const goBack = useGoBack();

  const onPressBack = () => {
    onClickTrack({
      blockId: 'button',
      locationId: 'back',
    });
    goBack();
  };

  return (
    <FillApplicationPage>
      <Header
        style={css`
          background-color: ${colorV2.overlay};
        `}
        contentStyle={css`
          background-color: ${colorV2.overlay};
        `}
        onPressBack={onPressBack}
      />

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={css`
          margin: 0 16px;
        `}>
        <FillFormTitle>{_t('76c1b248d1b64000a2ee')}</FillFormTitle>
        <FillBanner>
          <TipIconWrap>
            <WarnIcon />
          </TipIconWrap>
          <TipText>{_t('7089b700a4744000a537')}</TipText>
        </FillBanner>
        <Form formMethods={formMethods}>
          <StyledFormField label={''} name="avatar">
            {register => (
              <SelectAvatar {...register} control={formMethods.control} />
            )}
          </StyledFormField>
          <StyledInputField
            name="nickName"
            label={_t('84895fb7fb9b4000a026')}
            size="large"
            rules={{
              required: true,
            }}
            originInputProps={{
              maxLength: MaxLengthMap.modifyTraderNickName,
            }}
            placeholder={_t('3c8d81b620504000ae76')}
          />

          <StyledInputField
            name="profile"
            label={_t('4d3c034c38e84000a35c')}
            maxLength={MaxLengthMap.modifyTraderIntro}
            placeholder={_t('6da505dd8eb04000a30e')}
            multiline={true}
            rules={{
              required: true,
            }}
            styles={{
              exInput: css`
                height: 116px;
              `,
            }}
            originInputProps={{
              multiline: true,
              numberOfLines: 4,
              maxLength: MaxLengthMap.modifyTraderIntro,
              textAlignVertical: 'top',
            }}
          />

          <StyledFormField
            label={_t('bd616dca8d2d4000a2a0')}
            name="groupType"
            style={css`
              margin-bottom: 12px;
            `}>
            {register => (
              <Radio.Group
                {...register}
                toggleSelection
                style={css`
                  ${commonStyles.flexRowCenter};
                `}>
                <StyledRadio value={GroupAccountType.Twitter}>
                  <RadioText>X (Twitter)</RadioText>
                </StyledRadio>
                <StyledRadio
                  value={GroupAccountType.Telegram}
                  style={css`
                    margin-left: 24px;
                  `}>
                  <RadioText>{_t('7492cc33f7164000a422')}</RadioText>
                </StyledRadio>
              </Radio.Group>
            )}
          </StyledFormField>

          <StyledInputField
            name="groupAccount"
            label={null}
            maxLength={300}
            placeholder={_t('4705123c4e0e4000abc7')}
          />
          {/*
         // 一期去除 上传凭证
          <StyledFormField
            label={<TradePerfLabel />}
            name="tradeProveFileList"
            style={css`
              margin-bottom: 12px;
            `}>
            {props => <UploadProve {...props} />}
          </StyledFormField> */}
        </Form>
      </ScrollView>

      <View
        style={css`
          padding: 16px 16px 0;
        `}>
        <AttentionWrap>
          <StyledRadio
            type={EnhanceRadioType.check}
            checked={isAgree}
            onChange={() => setIsAgree(!isAgree)}
          />

          <AttentionText>
            <RichLocale
              TextComponent={AttentionText}
              message={_t('1058274a0f5d4000a184')}
              renderParams={{
                DESC: {
                  component: AgreementList,
                  componentProps: {
                    scene: AGREEMENT_SCENE_TYPE.LEAD_TRADE,
                  },
                },
              }}
            />
          </AttentionText>
        </AttentionWrap>
        <Button
          style={css`
            margin-bottom: 16px;
          `}
          loading={isSubmitLoading || isPullAgreementLoading}
          onPress={handleSubmit(receiveFormSubmit)}>
          {_t('6e3b6dcd0aa34000a4c4')}
        </Button>
      </View>
    </FillApplicationPage>
  );
};

export default memo(FillApplyTraderForm);
