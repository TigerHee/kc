/*
 * @Owner: jesse.shao@kupotech.com
 */
/* * Owner: tom@kupotech.com  * */
import React, { useState } from 'react';
import { styled } from '@kufox/mui/emotion';

import { Drawer } from '@kufox/mui';
import { _t } from 'utils/lang';
import Match from '../MatchScore/Match';
import { SPLITER_WIDTH, CONTENT_WIDTH } from '../config';
import leftArrow from 'assets/cryptoCup/left-arrow.svg';
import close from 'assets/cryptoCup/other-match-close.svg';

const Main = styled(Drawer)`
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 0 21px 18px;
  height: 67vh;
  @media (min-width: ${SPLITER_WIDTH}px) {
    width: ${CONTENT_WIDTH}px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  justify-content: center;
  position: relative;
  font-weight: 500;
  font-size: 18px;
  text-align: center;
  color: #000d1d;
`;

const LeftIcon = styled.div`
  width: 14px;
  height: 14px;
  background: ${props => `url(${leftArrow}) no-repeat`};
  /* background-size: 100% 100%; */
  margin: 0 0 0 2px;
  position: absolute;
  left: 0;
  /* top: 22px; */

  background-size: auto;
  background-position: center;
  height: 100%;
  top: 0;
`;

const RightIcon = styled.div`
  width: 14px;
  height: 14px;
  background: url(${close}) no-repeat;
  /* background-size: 100% 100%; */
  margin: 0 0 0 2px;
  position: absolute;
  right: 0;
  /* top: 22px; */

  background-size: auto;
  background-position: center;
  height: 100%;
  top: 0;
`;

const Content = styled.div`
  height: calc(100% - 56px);
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
    background: transparent;
    width: 2px;
    height: 2px;
  }
`;

function MatchArenaDetailModal({ onClose }) {
  return (
    <Main show onClose={onClose} anchor={'bottom'}>
      <Header>
        <LeftIcon onClick={onClose} />
        <RightIcon onClick={() => onClose('all')} />
        <span>{_t('cryptoCup.otherMatch.title')}</span>
      </Header>
      <Content>
        <Match isDetail onClose={() => onClose('all')} />
      </Content>
    </Main>
  );
}

export default MatchArenaDetailModal;
