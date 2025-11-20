import React from 'react';
import styled, {css} from '@emotion/native';
import {Empty, Loading} from '@krn/ui';

import useLang from 'hooks/useLang';

const StyledLoading = styled(Loading)`
  margin: 200px auto;
`;

export const ListEmptyContent = ({loading, size}) => {
  const {_t} = useLang();

  if (loading && !size) {
    return <StyledLoading spin />;
  }
  return (
    <Empty
      style={css`
        margin: 32px 0;
        padding-bottom: 32px;
      `}
      text={_t('4597a0f251644000a761')}
    />
  );
};
