import React from 'react';
import styled from '@emotion/native';

import Alert from 'components/Common/Alert';
import {validateLeaderConfigHelper} from 'constants/businessType';
import useLang from 'hooks/useLang';

const StyledAlert = styled(Alert)`
  margin-bottom: 24px;
`;

export const TopAlert = ({leadStatus}) => {
  const {_t} = useLang();
  const isUndoing = validateLeaderConfigHelper.isUndoing(leadStatus);

  if (!isUndoing) {
    return null;
  }

  return <StyledAlert message={_t('e5b7281e36324000a303')} />;
};
