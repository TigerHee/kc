/**
 * Owner: willen@kupotech.com
 */
import {Empty, useTheme} from '@krn/ui';
import styled from '@emotion/native';
import React from 'react';

const ExtendEmpty = styled(Empty)`
  margin-top: 74px;
`;

export default ({text = ''}) => {
  const theme = useTheme();
  return (
    <ExtendEmpty
      textStyle={{
        textAlign: 'center',
        fontSize: 14,
        color: theme.colorV2.text40,
      }}
      imgType="empty"
      text={text}
    />
  );
};
