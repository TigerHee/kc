/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import { px2rem as _r } from '@kufox/mui/utils';
import backtopIcon from 'assets/NFTQuiz/back-top.svg';

const Wrapper = styled.section`
  position: fixed;
  z-index: 10;
  right: ${_r(16)};
  bottom: 24px;
  background: rgba(225, 232, 245, 0.12);
  box-shadow: 0px 8px 32px rgba(18, 25, 45, 0.0824137);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: ${_r(48)};
  height: ${_r(48)};
  >img {
    border: none;
    width: ${_r(16)};
    height: ${_r(16)};
  }
  > span {
    color: #fff;
    font-weight: 400;
    font-size: ${_r(12)};
    line-height: 130%;
  }
`;

const BackTop = ({ onClick }) => {
  
  return (
    <Wrapper onClick={onClick}>
      <img alt="scroll-top-icon" src={backtopIcon} />
      <span>Top</span>
    </Wrapper>
  );
}

export default BackTop;