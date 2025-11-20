/*
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import flag from 'assets/cryptoCup/flag2.svg';

function BlockTitle({ name = '', renderRight }) {
  const Wrapper = styled.div`
    width: 100%;
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 21px;
    align-items: center;
    color: #000d1d;
    display: flex;
  `;

  const TipsWrapper = styled.div`
    width: 30px;
    height: 19px;
    margin-right: 8px;
    background: url(${flag}) no-repeat;
    background-size: 100% 100%;
  `;
  const Text = styled.div`
    font-weight: 700;
    flex: 1;
  `;

  return (
    <Wrapper className="CryptoCup-BlockTitle">
      <TipsWrapper />
      <Text>{name}</Text>
      <>{renderRight ? renderRight() : null}</>
    </Wrapper>
  );
}

export default BlockTitle;
