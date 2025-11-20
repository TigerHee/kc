import React from 'react';
import styled from '@emotion/native';
import {Empty} from '@krn/ui';

import Button from 'components/Common/Button';
import Header from 'components/Common/Header';
import Radio from 'components/Common/Radio';
import {commonStyles} from 'constants/styles';

export const Container = styled.SafeAreaView`
  background-color: ${({theme}) => theme.colorV2.backgroundMajor};
  flex: 1;
`;

export const StyledHeader = styled(Header)``;

export const Content = styled.ScrollView`
  padding-top: 48px;
`;

export const SuccessIcon = styled(Empty)`
  width: 148px;
  height: 148px;
  flex: none;
`;

export const SuccessText = styled.Text`
  ${commonStyles.textStyle}
  font-size: 24px;
  line-height: 31.2px;
  margin-bottom: 4px;
  text-align: center;
`;

export const SuccessDesc = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.colorV2.text60};
  font-weight: 400;
  line-height: 24px;
  padding: 0 32px;
  text-align: center;
`;

export const FixedBottomArea = styled.View`
  width: 100%;
  background-color: ${({theme}) => theme.colorV2.backgroundMajor};
  position: absolute;
  bottom: 16px;
  padding: 16px;
  align-items: center;
`;

export const StyledSubmitBtn = styled(Button)`
  width: 100%;
`;

export const CancelText = styled.Text`
  ${commonStyles.textStyle}
  padding: 13.5px;
  font-size: 16px;
  line-height: 20.8px;
  margin-top: 16px;
`;

export const RadioText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 20.8px;
`;

export const AttentionWrap = styled.View`
  ${commonStyles.flexRowCenter};
  margin-bottom: 32px;
  justify-content: flex-start;
  flex: 1;
  width: 100%;
  padding-right: 16px;
`;

export const AttentionText = styled.Text`
  font-size: 16px;
  line-height: 22.4px;
  color: ${({theme}) => theme.colorV2.text60};
`;

export const GuideLinkText = styled(AttentionText)`
  color: ${({theme}) => theme.colorV2.text};
  text-decoration-line: underline;
`;

export const StyledRadio = props => <Radio {...props} sizeNumber={20} />;
