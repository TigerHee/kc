/**
 * Owner: john.zhang@kupotech.com
 */

import { styled, Tag } from '@kux/mui';
import { getStatusInfo } from '../../utils';

const StyledTag = styled(Tag)`
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 140%;
  width: max-content;
`;

const ClaimStatus = ({ status }) => {
  const info = getStatusInfo(status);
  if (!info) {
    return null;
  }
  return <StyledTag color={info.colorType}>{info.label}</StyledTag>;
};

export default ClaimStatus;
