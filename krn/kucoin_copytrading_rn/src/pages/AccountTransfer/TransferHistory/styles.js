import styled from '@emotion/native';

import Header from 'components/Common/Header';
import {BetweenWrap} from 'constants/styles';

export const Container = styled.SafeAreaView`
  background-color: ${({theme}) => theme.colorV2.backgroundMajor};
  flex: 1;
`;

export const StyledHeader = styled(Header)`
  background: ${({theme}) => theme.colorV2.backgroundMajor};
`;

export const ItemWrap = styled(BetweenWrap)`
  border-bottom-width: 0.5px;
  border-color: ${({theme}) => theme.colorV2.divider8};
  padding: 13.5px 16px;
`;

export const LabelText = styled.Text`
  font-size: 15px;
  line-height: 19.5px;
  font-weight: 500;
  color: ${({theme}) => theme.colorV2.text};
`;

export const ValueText = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 12px;
  line-height: 15.6px;
`;

export const FilterBarWrap = styled.View`
  padding: 10px 0;
  border-bottom-width: 1px;
  border-color: ${({theme}) => theme.colorV2.divider8};
`;
