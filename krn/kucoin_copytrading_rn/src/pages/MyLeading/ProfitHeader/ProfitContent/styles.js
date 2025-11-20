import styled, {css} from '@emotion/native';

import {commonStyles, RowWrap} from 'constants/styles';

export const CopyProfitHeaderWrapper = styled.View`
  background-color: transparent;
  padding: 24px 16px 16px;
`;

export const DescText = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 15.6px;
`;

export const LargeProfit = styled(DescText)`
  font-size: 26px;
  font-weight: 600;
  margin-top: 2px;
  line-height: 31.2px;
`;

export const TinyProfit = styled.Text`
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
  align-items: flex-start;
`;

export const CurrentCopyAmountWrap = styled.View`
  margin-top: 16px;
  padding: 12px;
  border-radius: 12px;
  background: ${({theme}) => theme.colorV2.cover2};
`;

export const CurrentCopyAmountLabel = styled.Text`
  ${commonStyles.textSecondaryStyle};
`;

export const AmountText = styled.Text`
  ${commonStyles.textStyle};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
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

export const ShareProfitBox = styled.View`
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: ${({theme}) => theme.colorV2.divider8};
`;
export const ShareProfitItem = styled(RowWrap)`
  justify-content: space-between;
`;

export const makeDescTextStyle = colorV2 => css`
  color: ${colorV2.text40};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 15.6px;
`;
