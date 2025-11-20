import React from 'react';

import {Number} from 'components/Common/UpOrDownNumber';

export const AmountComp = ({children}) => {
  return <Number hiddenPositiveChar>{children}</Number>;
};
