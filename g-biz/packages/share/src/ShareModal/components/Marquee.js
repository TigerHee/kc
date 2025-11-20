/**
 * Owner: terry@kupotech.com
 */
import { styled, useResponsive } from '@kux/mui';
import React, { useRef, useState, useEffect, useMemo } from 'react';

import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import infoContain from '../../asset/info-contain.svg';

export const MarqueeWrapper = styled.section`
  display: flex;
  white-space: nowrap;
  width: fit-content;
  height: 100%;
  position: absolute;
  .highlight1,
  strong {
    color: rgba(0, 13, 29, 0.68);
    font-weight: 500;
  }
  strong + span {
    color: rgba(29, 29, 29, 0.4);
    font-weight: 500;
  }
  opacity: ${({ scrollX }) => (scrollX === -1 ? 0 : 1)};
  ${(props) =>
    props.scrollX > 0 &&
    `
    animation: ${Math.floor((props.scrollX * 1000) / 60)}ms move linear infinite normal;
    animation-delay: 1s;
    backface-visibility: hidden;
    animation-play-state: running;
  `}
  /* &:hover {
    animation-play-state: paused;
  } */
  [dir='rtl'] & {
    ${(props) =>
      props.scrollX > 0 &&
      `
      animation: ${Math.floor((props.scrollX * 1000) / 60)}ms move2 linear infinite normal;
    `}
  }
  @keyframes move {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(-50%, 0, 0);
    }
  }
  @keyframes move2 {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(50%, 0, 0);
    }
  }
`;

export const MarqueeItem = styled.div`
  font-family: Kufox Sans;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: rgba(29, 29, 29, 0.4);
  padding-right: 40px;
  ${(props) =>
    props?.isPc &&
    `
    font-size: 14px;
    `}
`;

export const MarqueeBox = styled.section`
  position: relative;
  width: 100%;
  height: 16px;
  align-items: center;
  overflow: hidden;
  opacity: ${(props) => (props?.isHidden ? 0 : 1)};
`;

export const MarqueePage = styled.div`
  display: flex;
  width: 100%;
  background: rgba(29, 29, 29, 0.02);
  border-radius: 80px;
  align-items: center;
  padding: 8px 12px;
  margin: 0px 16px;
  .MarqueePage_img {
    width: 12px;
    height: 12px;
    margin-right: 4px;
    [dir='rtl'] & {
      margin-right: 0;
      margin-left: 4px;
    }
    ${(props) =>
      props?.isPc &&
      `
      width: 16px;
      height: 16px;
      margin-right: 8px;
    `}
  }
  ${(props) =>
    props?.isPc &&
    `
      margin: 20px 0;
      padding: 12px 16px;
    `}
`;

export const Wrapper = styled.section`
  width: 100%;
  padding: 10px 16px;
  margin-top: 10px;
`;

const Index = ({ text = 'Share now' }) => {
  const listRef = useRef();
  const [start, updateStart] = useState(false);
  const [scroll, updateScroll] = useState(-1);
  const { xs, sm, lg, xl } = useResponsive();
  const isMobile = xs && !sm && !lg && !xl; // 是否h5
  const list = useMemo(() => {
    return [{ text }];
  }, [text]);

  useEffect(() => {
    if (!listRef.current || isEmpty(list)) return;
    setTimeout(() => {
      const width = listRef.current?.parentNode?.clientWidth || 0;
      const scrollWidth = listRef?.current?.scrollWidth;
      const hasScroll = scrollWidth > width && scrollWidth !== 0 && width !== 0 ? scrollWidth : 0;
      updateScroll(hasScroll);
      if (hasScroll > 0) updateStart(true);
    }, 200);
  }, [listRef.current, list]);

  const displayList = useMemo(() => {
    if (!start) return list;
    return [...list, ...list];
  }, [start, list]);

  const isHidden = !displayList.length;

  return (
    <MarqueePage isPc={!isMobile}>
      <img className="MarqueePage_img" src={infoContain} alt="infoContain" />
      <MarqueeBox isHidden={isHidden}>
        <MarqueeWrapper ref={listRef} scrollX={scroll}>
          {!isHidden
            ? map(displayList, (item, idx) => {
                return (
                  <MarqueeItem isPc={!isMobile} key={idx} first={idx === 0}>
                    {item?.text}
                  </MarqueeItem>
                );
              })
            : null}
        </MarqueeWrapper>
      </MarqueeBox>
    </MarqueePage>
  );
};

export default Index;
