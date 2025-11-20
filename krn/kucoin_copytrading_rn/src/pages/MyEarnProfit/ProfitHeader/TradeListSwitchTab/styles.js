import styled from '@emotion/native';
import {Tabs} from '@krn/ui';

import {commonStyles, RowWrap} from 'constants/styles';

export const BarWrap = styled(RowWrap)`
  margin: 16px 0px 8px;
  padding: 0 16px;
  justify-content: space-between;
`;

export const BarText = styled.Text`
  ${commonStyles.textSecondaryStyle};
`;

export const BtnText = styled.Text`
  ${commonStyles.textSecondaryStyle};
  font-weight: 500;
  color: ${({theme}) => theme.colorV2.primary};
`;

export const Gap = styled.View`
  background-color: ${({theme}) => theme.colorV2.divider8};
  width: 1px;
  height: 14px;
  margin: 0 8px;
`;

export const StyledTabs = styled(Tabs)`
  border-bottom-width: 0;
`;

export const StyledTab = styled(Tabs.Tab)`
  margin-left: ${({isFirstElement}) => (isFirstElement ? '0' : '24px')};
  margin-right: ${({isEndElement}) => (isEndElement ? '24px' : '0')};
`;

export const RemainingTip = styled.View`
  margin-top: 16px;
  border-radius: 8px;
  padding: 8px 12px;
  background-color: ${({theme}) => theme.colorV2.primary8};
`;

export const RemainingTipText = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 12px;
  font-weight: 400;
  line-height: 15.6px;
`;

export const SwitchTabWrap = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colorV2.overlay};
`;

export const BannerWrap = styled.View`
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  padding: 12px;
  background-color: ${({theme}) => theme.colorV2.primary8};
  margin: 16px 16px 0;
`;

export const TipText = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 18.2px;
  margin-left: 8px;
`;
