import {TextInput} from 'react-native';
import styled from '@emotion/native';

import Button from 'components/Common/Button';
import Card from 'components/Common/Card';
import Header from 'components/Common/Header';
import NumberFormat from 'components/Common/NumberFormat';
import {commonStyles, RowWrap} from 'constants/styles';
import {isAndroid} from 'utils/helper';

export const Container = styled.SafeAreaView`
  background-color: ${({theme}) => theme.colorV2.backgroundMajor};
  flex: 1;
`;

export const StyledHeader = styled(Header)`
  background: ${({theme}) => theme.colorV2.backgroundMajor};
`;
export const Content = styled.View`
  padding: 8px 16px 0;
  flex: 1;
  align-items: center;
`;

export const TransferTipText = styled.Text`
  ${commonStyles.textSecondaryStyle}
  font-size: 14px;
  line-height: 18.2px;
  margin-top: 24px;
`;

export const SuccessDesc = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.colorV2.text60};
  font-weight: 400;
  line-height: 24px;
`;

export const FixedBottomArea = styled.View`
  width: 100%;
  background-color: ${({theme}) => theme.colorV2.backgroundMajor};
  position: absolute;
  bottom: 0;
  padding: 16px;
  align-items: center;
`;

export const StyledSubmitBtn = styled(Button)`
  width: 100%;
`;

export const CancelText = styled.Text`
  ${commonStyles.textStyle}
  padding: 13.5px;
  margin-top: 16px;
`;

export const TransferDirBox = styled.Pressable`
  width: 40px;
  height: 40px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({theme}) => theme.colorV2.cover8};
  margin: 0 4px;
`;

export const TransferDirIc = styled.Image`
  width: 20px;
  height: 20px;
`;

export const DirValue = styled.Text`
  ${commonStyles.textStyle}
  font-weight: 500;
  margin-top: 4px;
`;
export const BetweenWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
export const FromOrToBox = styled.View`
  flex: 1;
  /* width: 130px; */
  align-items: ${({isRight}) => (isRight ? 'flex-end' : 'flex-start')};
`;

export const AmountCard = styled(Card)`
  background-color: ${({theme}) => theme.colorV2.cover2};
  align-items: center;
  width: 100%;
  border: 0;
  min-height: 204px;
`;

export const StyledButton = styled(Button)`
  width: 100%;
`;

export const BottomDesc = styled.Text`
  ${commonStyles.textSecondaryStyle}
  line-height: 18px;
  margin-top: 16px;
  text-align: center;
`;

export const TetherIc = styled.Image`
  width: 24px;
  height: 24px;
`;

export const CoinText = styled.Text`
  ${commonStyles.textStyle}
  font-weight: 500;
  font-size: 14px;
  margin: 0 8px;
  line-height: 18.2px;
`;

export const CoinUnitText = styled.Text`
  font-size: ${({shrink}) => (shrink ? '36px' : '48px')};
  align-items: center;
  font-weight: 400;
  margin-left: 4px;
  color: ${({theme}) => theme.colorV2.text20};
`;

export const InputPressableArea = styled.Pressable`
  width: 100%;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  height: 62px;
`;

export const InputRowWrap = styled(RowWrap)`
  max-width: 300px;
  align-self: center;
  // 解决Android端不垂直居中的问题
  text-align-vertical: center;
`;

export const StyledInputAmount = styled(TextInput)`
  border-width: 0;
  border-color: transparent;
  // 解决Android端不垂直居中的问题
  text-align-vertical: center;
  margin: 0;
  padding: 0;
  max-width: 206px;
  font-size: ${({shrink}) => (shrink ? '36px' : '48px')};
  line-height: ${({shrink}) => {
    if (isAndroid) {
      return shrink ? '46.8px' : '62px';
    }
    return shrink ? '42px' : '56px';
  }};
  color: ${({theme}) => theme.colorV2.text};
  text-align: right;
  font-weight: 600;
`;

export const AccountLabel = styled.Text`
  font-size: 14px;
  line-height: 18.2px;
  font-weight: 400;
  color: ${({theme}) => theme.colorV2.text40};
  padding-right: 4px;
  margin-bottom: 2px;
  /* margin-top: 24px; */
`;

export const ConvertIcon = styled.Image`
  width: 16px;
  height: 16px;
  margin-left: 4px;
`;

export const GapLine = styled.View`
  width: 1px;
  height: 12px;
  margin: 0 12px;
  background: ${({theme}) => theme.colorV2.divider8};
`;

export const MaxText = styled.Text`
  font-size: 14px;
  line-height: 18.2px;

  font-weight: 500;
  color: ${({theme}) => theme.colorV2.textPrimary};
`;

export const TradingAccountAmount = styled(NumberFormat)`
  font-size: 14px;
  line-height: 18.2px;
  font-weight: 500;
  color: ${({theme}) => theme.colorV2.text};
`;
export const CenterErrMsg = styled.Text`
  color: #f65454;
  font-size: 12px;
  font-weight: 400;
  line-height: 15.6px;
  text-align: center;
  margin-top: 24px;
`;

export const MRowWrap = styled(RowWrap)`
  margin-top: 24px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const InputPrefixChar = styled.Text`
  font-size: ${({shrink}) => (shrink ? '36px' : '48px')};
  color: ${({theme}) => theme.colorV2.text};
`;
