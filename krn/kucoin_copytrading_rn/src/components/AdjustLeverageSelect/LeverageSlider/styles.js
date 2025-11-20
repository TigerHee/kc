import styled from '@emotion/native';

import {RowWrap} from 'constants/styles';

export const SliderBackgroundWrap = styled.View`
  background-color: ${({theme}) => theme.colorV2.backgroundMajor};
`;

export const TrackMarkWrap = styled(RowWrap)`
  width: 10px;
  background-color: ${({theme}) => theme.colorV2.layer};
  justify-content: center;
`;

export const TrackMarkEdge = styled.View`
  width: 1px;
  height: 3px;
  border-radius: 0 1px 1px 0;
`;

export const TrackMarkRightEdge = styled(TrackMarkEdge)`
  width: 1px;
  height: 3px;
  background-color: ${({theme}) => theme.colorV2.primary};
  border-radius: 1px 0 0 1px;
`;

export const TrackMarkPoint = styled.View`
  width: 6px;
  height: 6px;
  margin: 0 12px;

  background-color: ${({theme, isCovered}) =>
    isCovered
      ? theme.colorV2.primary
      : theme.type === 'light'
      ? '#EDEDED'
      : '#454545'};
  border-radius: 6px;
`;
