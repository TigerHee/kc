/**
 * @Owner: Clyne@kupotch.com
 */

import React from 'react';
import { Wrapper } from './style.js';
import MarkPrice from '../FuturesDetail/MarkPrice.js';
import IndexPrice from '../FuturesDetail/IndexPrice.js';
import TurnOver from '../FuturesDetail/TurnOver.js';
import Volume from '../FuturesDetail/Volume.js';

const MFutureBaseInfo = () => {
  return (
    <>
      <Wrapper>
        <div className="m-column">
          <MarkPrice />
          <IndexPrice />
        </div>
      </Wrapper>
      <Wrapper>
        <div className="m-column">
          <Volume />
          <TurnOver />
        </div>
      </Wrapper>
    </>
  );
};

export default MFutureBaseInfo;
