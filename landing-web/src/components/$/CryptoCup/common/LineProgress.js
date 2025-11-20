/*
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';

function LineProgress({ percent }) {
  const Wrapper = styled.div`
    overflow: hidden;
    background: rgba(0, 13, 29, 0.08);
    border-radius: 10px;
    height: 2px;
    width: 46px;
    margin: 0 auto;
  `;

  const Item = styled.div`
    height: 100%;
    background: #2dc985;
    border-radius: 10px;
    width: ${props => props.width};
  `;

  const finalPercent = (Number(percent) || 0).toFixed(2);

  return (
    <Wrapper>
      <Item width={`${finalPercent}%`} />
    </Wrapper>
  );
}

export default LineProgress;
