/**
 * Owner: ella@kupotech.com
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NumberFormat } from '@kux/mui';
import { useLocale } from '@kucoin-base/i18n';
import point from 'static/bitcoin-halving/point.svg';
import pointnow from 'static/bitcoin-halving/pointnow.svg';
import pointdashed from 'static/bitcoin-halving/pointdashed.svg';
import pointarrw from 'static/bitcoin-halving/pointarrw.svg';
import arrow from 'static/bitcoin-halving/arrow.svg';
import { FirstHalving, SecondHalving, ThirdHalving, FourthHalving } from '../../config';
import {
  Tooltip,
  Title,
  Time,
  ItemWrapper,
  ItemTitle,
  ItemContent,
  TitleWrapper,
} from '../TimeLineLg/index.style';
import {
  ArrowLine,
  PointWrapper,
  TooltipWrapper,
  Point,
  PointNow,
} from '../TimeLineMd/index.style';
import { ArrowWrapper, TipArrowNow, TipArrow } from './index.style';

export default () => {
  const wrapperRef = useRef();
  const [width, setWidth] = useState(260);
  const { currentLang } = useLocale();

  const changeWidth = useCallback(() => {
    if (wrapperRef.current) {
      const parentNode = wrapperRef.current.parentNode;
      const parentWidth = parentNode.offsetWidth;
      const tooltipWidth = parentWidth - 48;
      setWidth(tooltipWidth);
    }
  }, []);

  useEffect(() => {
    changeWidth();
  }, [changeWidth]);

  useEffect(() => {
    window.addEventListener('resize', changeWidth);
    return () => {
      window.removeEventListener('resize', changeWidth);
    };
  }, []);

  const renderContent = useCallback(
    (item) => {
      return (
        <ItemContent>
          {item.needFormat ? (
            <React.Fragment>
              {item.preUnit ? item.preUnit : ''}
              <NumberFormat
                options={{
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }}
                lang={currentLang}
              >
                {item.content}
              </NumberFormat>
            </React.Fragment>
          ) : (
            item.content
          )}
        </ItemContent>
      );
    },
    [currentLang],
  );

  return (
    <ArrowWrapper ref={wrapperRef}>
      <ArrowLine>
        <PointWrapper>
          <TooltipWrapper width={width}>
            <Tooltip border>
              <TipArrow src={pointarrw} alt="icon" />
              <TitleWrapper>
                <Title>{FirstHalving.title}</Title>
                <Time>{FirstHalving.date && FirstHalving.date(currentLang)}</Time>
              </TitleWrapper>
              {FirstHalving.list.map((item) => {
                return (
                  <ItemWrapper key={item.info}>
                    <ItemTitle>{item.info}</ItemTitle>
                    {renderContent(item)}
                  </ItemWrapper>
                );
              })}
            </Tooltip>
          </TooltipWrapper>
          <Point src={point} alt="icon" />
        </PointWrapper>
        <PointWrapper>
          <TooltipWrapper width={width}>
            <Tooltip border>
              <TipArrow src={pointarrw} alt="icon" />
              <TitleWrapper>
                <Title>{SecondHalving.title}</Title>
                <Time>{SecondHalving.date && SecondHalving.date(currentLang)}</Time>
              </TitleWrapper>
              {SecondHalving.list.map((item) => {
                return (
                  <ItemWrapper key={item.info}>
                    <ItemTitle>{item.info}</ItemTitle>
                    {renderContent(item)}
                  </ItemWrapper>
                );
              })}
            </Tooltip>
          </TooltipWrapper>
          <Point src={point} alt="icon" />
        </PointWrapper>
        <PointWrapper>
          <TooltipWrapper width={width}>
            <Tooltip border>
              <TipArrow src={pointarrw} alt="icon" />
              <TitleWrapper>
                <Title>{ThirdHalving.title}</Title>
                <Time>{ThirdHalving.date && ThirdHalving.date(currentLang)}</Time>
              </TitleWrapper>
              {ThirdHalving.list.map((item) => {
                return (
                  <ItemWrapper key={item.info}>
                    <ItemTitle>{item.info}</ItemTitle>
                    {renderContent(item)}
                  </ItemWrapper>
                );
              })}
            </Tooltip>
          </TooltipWrapper>
          <Point src={point} alt="icon" />
        </PointWrapper>
        <PointWrapper>
          <TooltipWrapper now width={width}>
            <Tooltip now>
              <TipArrowNow src={pointdashed} alt="icon" />
              <TitleWrapper>
                <Title>{FourthHalving.title}</Title>
                <Time>{FourthHalving.date && FourthHalving.date(currentLang)}</Time>
              </TitleWrapper>
              {FourthHalving.list.map((item) => {
                return (
                  <ItemWrapper key={item.info}>
                    <ItemTitle>{item.info}</ItemTitle>
                    {renderContent(item)}
                  </ItemWrapper>
                );
              })}
            </Tooltip>
          </TooltipWrapper>
          <PointNow src={pointnow} alt="icon" />
        </PointWrapper>
      </ArrowLine>
      <img src={arrow} alt="arrow" />
    </ArrowWrapper>
  );
};
