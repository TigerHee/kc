import {Pressable} from 'react-native';
import styled, {css} from '@emotion/native';

import {RowWrap} from 'constants/styles';
import {getEnhanceColorByType} from 'utils/color-helper';
import {convertPxToReal} from 'utils/computedPx';

export const RevertInputWrap = styled.View`
  padding-bottom: 100px;
`;

export const InputLimit = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0.5px;
`;

export const MChooseItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  border-width: 1px;
  border-style: solid;
  border-color: ${({theme, active}) =>
    theme.colorV2[active ? 'text' : 'cover12']};
  border-radius: 8px;
  padding: 16px 12px;
  margin-bottom: 12px;
`;

export const Label = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  margin-right: 10px;
`;

export const ReasonWrap = styled.View`
  margin: 24px 0 12px;
`;

export const UndoConfirmDesc = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px;
  margin-top: 8px;
`;

export const MOrderWrap = styled.View`
  align-items: center;
  border-radius: 8px;
  background-color: ${({theme}) => theme.colorV2.cover4};
  padding: 16px 16px 0;
  margin-top: 24px;
  margin-bottom: 16px;
`;

export const MOrderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  width: 100%;
`;

export const OrderLabel = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
`;

export const OrderRight = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const OrderRightText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 600;
  margin-right: 12px;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
`;
export const StyledTabs = styled(RowWrap)`
  padding: 4px;
  margin-top: 16px;
  border-radius: 8px;
  background: ${({theme}) =>
    theme.type === 'light' ? theme.colorV2.cover4 : theme.colorV2.layer};

  ${({theme}) => {
    if (theme.type !== 'light')
      return `
      border: 1px solid ${theme.colorV2.divider8};
      `;
  }};
`;

export const StyledTab = styled(Pressable)`
  flex: 1;
  padding: 6px 12px;
  border-radius: 6px;
  ${({theme, isActive}) =>
    isActive &&
    `background-color:  ${
      theme.type === 'light' ? theme.colorV2.overlay : theme.colorV2.cover8
    }`}
`;

export const StyledText = styled.Text`
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 18.2px;
  color: ${({theme, isActive}) =>
    isActive ? theme.colorV2.text : theme.colorV2.text40};
`;

export const AmountChangeRowWrap = styled.View`
  margin: 16px 0;
  padding: 8px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const AmountChangeItemWrap = styled.View`
  width: ${convertPxToReal(140)};
`;

export const AmountChangeLabel = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 12px;
  font-weight: 500;
  line-height: 15.6px;
  margin-bottom: 4px;
`;

export const AmountChangeValue = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 20px;
  line-height: 24px;
  font-weight: 600;
  line-height: 24px; /* 120% */
  letter-spacing: 0.5px;
`;

export const DescWrap = styled.View`
  margin-top: 16px;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  background: ${({theme}) => theme.colorV2.complementary8};
`;

export const FirstPressableLine = styled(Pressable)`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const DescText = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 14px;
  line-height: 21px;
`;

export const ArrowIc = styled.Image`
  width: 20px;
  height: 20px;
  margin-left: auto;
`;
export const InputLabel = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 12px;
  font-weight: 500;
  line-height: 15.6px;
`;

export const InputAmountUnit = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 16px;
  font-weight: 400;
  line-height: 24px; /* 150% */
  letter-spacing: 0.5px;
`;

export const CanUseBalanceLabel = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 15.6px; /* 150% */
`;

export const ErrMsg = styled.Text`
  color: ${({theme}) => getEnhanceColorByType(theme.type, 'brandRed')};
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 400;
  line-height: 15.6px;
`;

export const MaxCanDecreaseText = styled.Text`
  margin-left: auto;
  color: ${({theme}) => theme.colorV2.text};
  font-size: 12px;
  font-weight: 500;
  line-height: 15.6px;
`;

export const RightRow = styled(RowWrap)`
  justify-content: flex-end;
`;

export const ExtraAmountText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 12px;
  font-weight: 500;
  line-height: 15.6px;
`;

export const ConvertIcon = styled.Image`
  width: 16px;
  height: 16px;
  margin-left: 4px;
`;

export const makeMaxAmountTipStyle = colorV2 => css`
  color: ${colorV2.text40};
  font-size: 12px;
  font-weight: 400;
  line-height: 15.6px; /* 150% */
`;
