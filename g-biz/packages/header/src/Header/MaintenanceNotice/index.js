/**
 * Owner: iron@kupotech.com
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { styled, useResponsive } from '@kux/mui';

import Marquee from 'react-fast-marquee';
import { useLang } from '../../hookTool';
import closeIcon from '../../../static/newHeader/maintenance_close.svg';

export const HEIGHT = 40;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: ${HEIGHT}px;
  text-align: center;
  background: linear-gradient(0deg, rgba(255, 181, 71, 0.08), rgba(255, 181, 71, 0.08)), #ffffff;
  line-height: ${HEIGHT}px;
  padding-left: 40px;
  padding-right: 40px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-right: 12px;
    padding-left: 12px;
  }
`;

const Main = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Content = styled.span`
  overflow: hidden;
  font-weight: normal;
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  margin-right: 8px;
  white-space: nowrap;
`;

const MarqueeGap = styled.span`
  display: inline-block;
  width: 100px;
`;

const Link = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border: 0.5px solid ${({ theme }) => theme.colors.complementary};
  text-align: center;
  border-radius: 4px;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  word-break: keep-all;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.complementary};
  & a,
  a:hover,
  a:visited,
  a:active {
    color: inherit;
    text-decoration: none;
  }
`;

const CloseIcon = styled.img`
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin-left: 10px;
`;

export default (props) => {
  const { maintenance, closeShow } = props;
  const { t } = useLang();
  const rv = useResponsive();
  const downSmall = !rv?.sm;
  const titleRef = useRef(null);
  const titleParentRef = useRef(null);
  const [needScroll, setNeedScroll] = useState(false);
  const clickClose = useCallback(() => {
    if (typeof closeShow === 'function') {
      closeShow();
    }
  }, [closeShow]);
  const {
    title = '', // 公告内容
    link = '', // 公告跳转链接
    redirectContent = '', // 跳转文本
  } = maintenance || {};

  useEffect(() => {
    // 加上一定的延时，防止拿不到正确的dom size
    setTimeout(() => {
      const titleEl = titleRef.current;
      const parentEl = titleParentRef.current;
      if (titleEl && parentEl) {
        const _needScroll = titleEl.clientWidth > parentEl.clientWidth + 12;
        if (_needScroll) {
          // 设置滚动容器的父元素宽度，使react-fast-marquee可以准确计算父容器宽度
          titleEl.style.width = `${titleEl.clientWidth}px`;
          setNeedScroll(true);
        } else {
          setNeedScroll(false);
        }
      }
    }, 100);
  }, [titleRef.current, titleParentRef.current, rv]);

  return (
    <Wrapper>
      <Main>
        <Content ref={titleParentRef}>
          <span ref={titleRef} style={{ display: 'inline-block' }}>
            {needScroll ? (
              <Marquee autoFill delay={1.5} pauseOnHover={!downSmall}>
                {title}
                <MarqueeGap />
              </Marquee>
            ) : (
              <span>{title}</span>
            )}
          </span>
        </Content>
        {link && (
          <Link>
            <a href={link} target="_blank">
              {redirectContent || t('view.more')}
            </a>
          </Link>
        )}
      </Main>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <CloseIcon src={closeIcon} onClick={clickClose} alt="close icon" />
    </Wrapper>
  );
};
