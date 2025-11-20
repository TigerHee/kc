import styled from '@emotion/native';

import AdjustLeverageSelect from 'components/AdjustLeverageSelect';
import Button from 'components/Common/Button';
import Header from 'components/Common/Header';
import NumberFormat from 'components/Common/NumberFormat';
import {commonStyles, RowWrap} from 'constants/styles';

export const SettingContainer = styled.View`
  background-color: ${({theme}) => theme.colorV2.background};
  flex: 1;
`;

export const StyledHeader = styled(Header)`
  background: ${({theme}) => theme.colorV2.background};
`;

export const Content = styled.View`
  background-color: ${({theme}) => theme.colorV2.overlay};
  border-radius: 20px 20px 0px 0px;
  padding: 8px 0px 100px;
  flex: 1;
`;

export const FormContent = styled.View`
  padding: 0 16px;
  flex: 1;
  background-color: ${({theme}) => theme.colorV2.overlay};
  padding-bottom: 100px;
`;

export const FormWrap = styled.View`
  padding: 8px 16px;
  flex: 1;
`;

export const FixedBottomArea = styled.View`
  width: 100%;
  ${commonStyles.flexRowCenter}
  padding: 16px;
  margin-bottom: 16px;
  bottom: 0;
  background: ${({theme}) => theme.colorV2.overlay};
`;

export const StyledSubmitBtn = styled(Button)`
  flex: 1;
`;

export const ExtraLabelText = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 12px;
  font-weight: 400;
  line-height: 15.6px;
`;
export const PromiseModeSection = styled.View`
  margin-bottom: 16px;
`;

export const GrayCard = styled.View`
  margin-top: 8px;
  border-radius: 8px;
  background: ${({theme}) => theme.colorV2.cover4};
  padding: 16px;
  margin-bottom: 16px;
`;
export const MarginRadioWrap = styled(RowWrap)`
  margin-top: 16px;
`;

export const SwitchText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
  margin-left: 8px;
`;

export const StyledAdjustLeverageSelect = styled(AdjustLeverageSelect)`
  margin-left: 8px;
`;

export const SymbolSuffix = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`;

export const DueLossPrice = styled(NumberFormat)`
  color: #f65454;
  font-size: 12px;
  line-height: 15.6px;
  font-weight: 400;
`;

export const RadioText = styled.Text`
  font-size: 14px;
  color: ${({theme}) => theme.colorV2.text};
  font-weight: 500;
  line-height: 18.2px;
`;

export const BgWrap = styled.View`
  flex: 1;
`;

export const ReadOnlyContent = styled.View`
  flex: 1;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  z-index: 999;
  background-color: ${({theme}) => theme.colorV2.overlay};
`;

export const EditPageWrap = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colorV2.overlay};
`;
