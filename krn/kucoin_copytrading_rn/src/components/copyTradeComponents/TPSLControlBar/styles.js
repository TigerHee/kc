import styled, {css} from '@emotion/native';

import {Number} from 'components/Common/UpOrDownNumber';
import {BetweenWrap, RowWrap} from 'constants/styles';

export const DividerLine = styled.View`
  background: ${({theme}) => theme.colorV2.divider8};
  height: 0.5px;
  flex: 1;
  margin-top: 10px;
`;

export const ControlItemWrap = styled(BetweenWrap)`
  flex: 1;
  margin-top: 10px;
`;

export const makeLabelTextStyle = theme => css`
  color: ${theme.colorV2.text40};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 15.6px;
`;
export const PositionLabelText = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 12px;
  font-weight: 500;
  line-height: 15.6px;
`;

export const ConfigValueText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
  margin-right: 8px;
`;

export const CollapseBar = styled(RowWrap)`
  margin-top: 8px;
  align-items: center;
  justify-content: center;
`;

export const CollapseText = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 15.6px;
`;

export const PositionDirectionPrice = styled(Number)`
  color: ${({isTP, theme}) =>
    isTP ? theme.colorV2.chartUpColor : theme.colorV2.chartDownColor};
`;
