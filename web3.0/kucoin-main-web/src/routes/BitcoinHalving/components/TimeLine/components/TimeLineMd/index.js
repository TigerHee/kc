/**
 * Owner: ella@kupotech.com
 */
import React, { useCallback } from 'react';
import { NumberFormat } from '@kux/mui';
import { useLocale } from '@kucoin-base/i18n';
import point from 'static/bitcoin-halving/point.svg';
import pointnow from 'static/bitcoin-halving/pointnow.svg';
import pointarrw from 'static/bitcoin-halving/pointarrw.svg';
import pointdashed from 'static/bitcoin-halving/pointdashed.svg';
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
  ArrowWrapper,
  Point,
  PointNow,
  ArrowLine,
  Triangle,
  PointWrapper,
  TooltipWrapper,
  TipArrowNow,
  TipArrowRight,
  TipArrow,
} from './index.style';

export default () => {
  const { currentLang } = useLocale();

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
    <ArrowWrapper>
      <ArrowLine>
        <PointWrapper>
          <TooltipWrapper>
            <Tooltip border>
              <TipArrowRight src={pointarrw} alt="icon" />
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
          <TooltipWrapper left>
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
          <TooltipWrapper>
            <Tooltip border>
              <TipArrowRight src={pointarrw} alt="icon" />
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
          <TooltipWrapper left now>
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
      <Triangle />
    </ArrowWrapper>
  );
};
