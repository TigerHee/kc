import React from 'react';
import {css} from '@emotion/native';

import TipTrigger from 'components/Common/TipTrigger';

export default ({text, message}) => (
  <TipTrigger
    textStyle={css`
      font-size: 12px;
      font-weight: 500;
      line-height: 15.6px;
    `}
    showUnderLine={false}
    showIcon
    text={text}
    textColor="text60"
    message={message}
  />
);
