import styled, {css} from '@emotion/native';

import {Number} from 'components/Common/UpOrDownNumber';
import {commonStyles} from 'constants/styles';

export const CopyProfitHeaderWrapper = styled.View`
  background-color: transparent;
  padding: 16px;
  padding-bottom: 24px;
`;

export const DescText = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 15.6px;
`;

export const makeDescTextStyle = theme => css`
  color: ${theme.colorV2.text40};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 15.6px;
`;

export const LargeProfit = styled(Number)`
  font-size: 28px;
  font-weight: 600;
  margin-top: 2px;
  line-height: 36.4px;
`;

export const TinyProfit = styled(Number)`
  margin-top: 4px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
`;

export const DateText = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: ${({theme}) => theme.colorV2.text40};
  margin-top: 2px;
  line-height: 15.6px;
`;

export const FirstProfitDescWrap = styled.View`
  ${commonStyles.flexRowCenter};
  ${commonStyles.justifyBetween};
  align-items: flex-start;
  margin-bottom: 10px;
`;

export const SecondProfitLineWrap = styled.View`
  ${commonStyles.flexRowCenter};
  ${commonStyles.justifyBetween};
  align-items: center;
`;

export const CurrentCopyAmountWrap = styled.View`
  margin-top: 16px;
  padding: 12px;
  border-radius: 12px;
  align-items: center;
  background: ${({theme}) => theme.colorV2.cover2};
  flex-direction: row;
  flex-wrap: wrap;
`;

export const CurrentCopyAmountLabel = styled.Text`
  ${commonStyles.textSecondaryStyle};
  margin-right: 4px;
`;

export const CurrentCopyAmount = styled.Text`
  ${commonStyles.textStyle};
  font-size: 14px;
  font-weight: 500;
`;

export const Circle = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 32px;
  background: ${({theme}) => theme.colorV2.cover4};
  align-items: center;
  justify-content: center;
`;

export const ActionIcon = styled.Image`
  width: 20px;
  height: 20px;
`;
