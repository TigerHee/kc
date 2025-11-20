/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { usePageExpire } from '@/hooks/common/usePageExpire';
import { isFuturesCrossNew } from '@/meta/const';

import Compute from './Compute';
import PositionFieldCalc from './PositionFieldCalc';

const SocketDataFormulaCalc = () => {
  const pageExpiredTimer = usePageExpire();
  // 过期退到后台
  if (pageExpiredTimer) {
    return null;
  }

  return <>{isFuturesCrossNew() ? <Compute /> : <PositionFieldCalc />}</>;
};

export default React.memo(SocketDataFormulaCalc);
