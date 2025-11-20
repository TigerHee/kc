/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { _tHTML } from 'src/utils/lang';

import { PrizePoolDiv } from './StyledComps';

// 奖池
const PrizePool = ({ number }) => {
  return (
    <PrizePoolDiv>
      <div className="prizePool">
        {_tHTML('prediction.solo', { a: number })}
      </div>
    </PrizePoolDiv>
  );
};

export default PrizePool;
