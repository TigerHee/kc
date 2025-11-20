import styled from '@emotion/native';

import NumberFormat from 'components/Common/NumberFormat';
import {commonStyles} from 'constants/styles';

export const LendTitle = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  margin-right: 4px;

  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 20.8px;
`;

export const CopyTradeProfitWrapper = styled.View`
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

export const LargeProfit = styled(DescText)`
  font-size: 28px;
  font-weight: 600;
  margin-top: 2px;
  line-height: 36.4px;
`;

export const TinyProfit = styled(DescText)`
  font-size: 14px;
  line-height: 18.2px;
  margin-left: 4px;
  color: ${({theme}) => theme.colorV2.text};
  font-weight: 500;
`;

export const ArrowImg = styled.Image`
  width: 16px;
  height: 16px;
  margin-left: 4px;
`;

export const FirstProfitLineWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const SecondProfitLineWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

export const CurrentCopyAmountWrap = styled.Pressable`
  margin-top: 12px;
  padding: 12px;
  border-radius: 12px;
  background: ${({theme}) => theme.colorV2.cover2};
`;

export const CurrentCopyAmountLabel = styled.Text`
  ${commonStyles.textSecondaryStyle};
  margin-right: 4px;
`;

export const CurrentCopyAmount = styled(NumberFormat)`
  ${commonStyles.textStyle};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
`;

export const Wrap = styled.Pressable`
  background: ${({theme}) => theme.colorV2.overlay};
`;

export const HomeTopRightArrowWrap = styled.Pressable`
  margin-left: auto;
`;

export const HomeTopRightChartWrap = styled.View`
  margin-top: auto;
`;
