/*
 * @Owner: jesse.shao@kupotech.com
 */
/* * Owner: tom@kupotech.com  * */
import React from 'react';
import { styled } from '@kufox/mui/emotion';

const Wrapper = styled.div`
  display: flex;
`;

const TriangleIcon = styled.div`
  width: 0;
  height: 0;
  border-color: ${props =>
    props.arrow === 'left'
      ? 'transparent #5aba97 #5aba97 transparent'
      : 'transparent transparent #5aba97 #5aba97'};
  border-width: 3px;
  border-style: solid;
`;

const Title = styled.div`
  padding: 1px 27px;
  color: #000d1d;
  white-space: nowrap;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  background: #9ef7ce;
  border-radius: 0 0 4px 4px;
`;

function PrizeTitle({ title }) {
  return (
    <Wrapper>
      <TriangleIcon arrow="left" />
      <Title>{title}</Title>
      <TriangleIcon arrow="right" />
    </Wrapper>
  );
}

export default PrizeTitle;
