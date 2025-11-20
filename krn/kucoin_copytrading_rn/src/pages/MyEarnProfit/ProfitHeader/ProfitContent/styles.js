import styled from '@emotion/native';

import NumberFormat from 'components/Common/NumberFormat';
import Percent from 'components/Common/Percent';
import {Number} from 'components/Common/UpOrDownNumber';
import {commonStyles} from 'constants/styles';

export const CopyProfitHeaderWrapper = styled.View`
  background-color: transparent;
  padding-bottom: 24px;
`;

export const DescText = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 15.6px;
  text-align: center;
`;

export const LargeProfit = styled(Number)`
  font-size: 26px;
  font-weight: 600;
  margin-top: 2px;
  line-height: 31.2px;
  text-align: center;
`;

export const TinyProfit = styled(NumberFormat)`
  margin-top: 4px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
  color: ${({theme, isNegative}) =>
    isNegative ? theme.colorV2.chartDownColor : theme.colorV2.chartUpColor};
`;

export const FirstProfitDescWrap = styled.View`
  margin: 24px 0;
`;

export const CurrentCopyAmountWrap = styled.View`
  ${commonStyles.flexRowCenter};
  padding: 16px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({theme}) => theme.colorV2.cover8};
`;

export const CurrentCopyAmountLabel = styled.Text`
  ${commonStyles.textSecondaryStyle};
  margin-right: 4px;
`;

export const SharingProfitAmount = styled(NumberFormat)`
  ${commonStyles.textStyle};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
  margin-top: 4px;
`;

export const SharingProfitRatio = styled(Percent)`
  ${commonStyles.textStyle};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
  margin-top: 4px;
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

export const ShareProfitItem = styled.View`
  flex: 1;
`;
