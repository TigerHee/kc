/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import Sort from './Sort';
import styled from '@emotion/styled';
import InvestBody from './InvestBody';

const FullHeight = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Scroller = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export default React.memo((props) => {
  return (
    <FullHeight>
      <Sort />
      <Scroller>
        <InvestBody {...props} />
      </Scroller>
    </FullHeight>
  );
});
