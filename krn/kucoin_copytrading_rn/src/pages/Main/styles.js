import styled from '@emotion/native';

import {TabList} from 'components/Headless/Tab/TabList';

export const MainWrap = styled.View`
  background-color: ${({theme}) => theme.colorV2.overlay};
  flex: 1;
`;

export const TabLabelText = styled.Text`
  color: ${({theme, isActive}) =>
    !isActive ? theme.colorV2.text40 : theme.colorV2.text};
  text-align: center;
  font-size: 14px;
  line-height: 16.8px;
  margin-right: 20px;
  font-weight: ${({isActive}) => (isActive ? '600' : '500')};
  padding-left: ${({isFirst}) => (isFirst ? '16px' : '0')};
`;

export const StyledTabList = styled(TabList)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 16px;
  background-color: ${({theme}) => theme.colorV2.overlay};
  border-bottom-width: 0.5px;
  border-bottom-color: ${({theme}) => theme.colorV2.divider8};
  overflow: hidden;
  height: 40px;
  z-index: 2;
`;

export const LabelWrap = styled.View`
  justify-content: center;
  height: 38px;
`;
