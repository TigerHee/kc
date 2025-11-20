import React from 'react';
import styled from '@emotion/native';

import {FormField, InputField} from 'components/Common/Form';
// import {Radio} from '@krn/ui';
import Radio from 'components/Common/Radio';
import {SafeAreaView} from 'components/Common/SafeAreaView';
import {commonStyles} from 'constants/styles';

export const FillApplicationPage = styled(SafeAreaView)`
  flex-direction: column;
  flex: 1;
  background-color: ${({theme}) => theme.colorV2.overlay};
`;

export const FillFormTitle = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 24px;
  font-weight: 600;
  line-height: 31.2px;
  margin-top: 8px;
  margin-bottom: 24px;
`;

export const StyledInputField = styled(InputField)`
  margin-bottom: 24px;
`;

export const StyledFormField = styled(FormField)`
  margin-bottom: 24px;
`;

export const RadioText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 20.8px;
`;

export const AttentionWrap = styled.View`
  ${commonStyles.flexRowCenter};
  margin-bottom: 16px;
`;

export const AttentionText = styled.Text`
  ${commonStyles.textSecondaryStyle};
  font-size: 14px;
  line-height: 21px;
`;

export const GuideLinkText = styled(AttentionText)`
  color: ${({theme}) => theme.colorV2.primary};
`;

export const StyledRadio = props => <Radio {...props} sizeNumber={20} />;

export const FillBanner = styled.View`
  background-color: ${({theme}) => theme.colorV2.cover4};
  border-radius: 4px;
  padding: 12px;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 24px;
`;

export const TipText = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  flex: 1;
`;

export const TipIconWrap = styled.View`
  margin: 2px 8px 0 0;
`;
