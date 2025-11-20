import styled from '@emotion/native';

import {BetweenWrap} from 'constants/styles';
import {convertPxToReal} from 'utils/computedPx';

export const TagUserBarWrap = styled.Pressable`
  flex-shrink: 0;
  flex-grow: 0;
  max-width: ${convertPxToReal(62)};
  width: auto;
  flex-direction: row;
  align-items: center;
`;

export const ActionFooterWrap = styled(BetweenWrap)`
  margin-top: 12px;
`;
