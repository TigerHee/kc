/*
 * @Owner: jesse.shao@kupotech.com
 */
/* * Owner: tom@kupotech.com  * */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import winTipsSvg from 'assets/cryptoCup/prize-win-tips.svg';
import failTipsSvg from 'assets/cryptoCup/prize-fail-tips.svg';

const Wrapper = styled.div`
  width: fit-content;
  width: -moz-fit-content;
  width: -webkit-fit-content;
  width: -o-fit-content;
  padding: 3px 16px;
  background: ${props =>
    props.type === 1 ? 'linear-gradient(90.38deg, #e9ffce 3.46%, #d8ffe2 99.88%)' : '#b6efff'};
  border: 1px solid #ffffff;
  border-radius: 90px;
  color: ${props => (props.type === 1 ? '#2dc985' : '#4b99e6')};
  font-weight: 500;
  font-size: 12px;
  position: relative;
`;

const TriangleIcon = styled.img`
  position: absolute;
  left: 15%;
  bottom: -7px;
  width: 10px;
`;

function Tips({ title, type }) {
  return (
    <Wrapper type={type}>
      <span>{title}</span>
      <TriangleIcon src={type === 1 ? winTipsSvg : failTipsSvg} alt="" />
    </Wrapper>
  );
}

export default Tips;
