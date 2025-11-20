/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { styled } from '@kufox/mui/emotion';
import backIcon from 'assets/antiPhishing/header_back.svg';
import { px2rem } from '@kufox/mui/utils';
import { Event } from 'helper';
import { throttle } from 'lodash';
import JsBridge from 'utils/jsBridge';
import router from 'umi/router';

const HeaderWrapper = styled.div`
  height: ${px2rem(44)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  max-width: ${px2rem(750)};
  left: 0;
  right: 0;
  margin: auto;
  padding: 0 ${px2rem(12)};
  top: ${({ isInApp }) => (isInApp ? px2rem(44) : 0)};
  background-color: ${({ showHeaderBg }) => (showHeaderBg ? '#3CE1AA' : 'transparent')};
  ::before {
    content: '';
    display: ${({ showHeaderBg }) => (showHeaderBg ? 'block' : 'none')};
    background-color: #3ce1aa;
    height: ${px2rem(44)};
    top: ${px2rem(-44)};
    left: 0;
    position: absolute;
    width: 100%;
    max-width: ${px2rem(750)};
  }
`;

const Left = styled.img`
  width: ${px2rem(24)};
  height: ${px2rem(24)};
`;

const Title = styled.h2`
  font-weight: 500;
  font-size: ${px2rem(18)};
  line-height: 130%;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0;
  flex: 1;
`;

const Right = styled.div`
  width: ${px2rem(24)};
`;

const Header = ({ isInApp }) => {
  const [showHeaderBg, setShowHeaderBg] = useState(false);
  // 监听父级容易滚动
  useEffect(() => {
    const ele = document.querySelector('#antiPhishingWrapper');
    const handler = throttle(() => {
      setShowHeaderBg(ele?.scrollTop > 370);
    }, 100);
    Event.addHandler(ele, 'scroll', handler);
    return () => {
      Event.removeHandler(ele, 'scroll', handler);
    };
  }, []);

  const handleClose = () => {
    if (isInApp) {
      JsBridge.open({ type: 'func', params: { name: 'exit' } });
    } else router.go(-1);
  };

  return (
    <HeaderWrapper isInApp={isInApp} showHeaderBg={showHeaderBg}>
      <Left src={backIcon} alt="back" onClick={handleClose} />
      <Title>Anti-Phishing</Title>
      <Right />
    </HeaderWrapper>
  );
};

export default Header;
