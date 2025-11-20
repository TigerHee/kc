/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { DeepIntoRivalContent } from '../../builtinComponents';

import { getBBO, useGetSymbolInfo } from '../../hooks/useGetData';

const DeepIntoRival = ({ values, onClose, onOk }) => {
  const { ask1, bid1 } = getBBO();
  const { symbolInfo } = useGetSymbolInfo();
  return (
    <DeepIntoRivalContent
      values={values}
      side={values?.side}
      onClose={onClose}
      symbolInfo={symbolInfo}
      ask1={ask1}
      bid1={bid1}
      onOk={onOk}
    />
  );
};

export default React.memo(DeepIntoRival);
