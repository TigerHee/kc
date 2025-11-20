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
  ArrowWrapper,
  ArrowLine,
  Triangle,
  Point,
  PointNow,
  PointWrapper,
  Tooltip,
  TooltipWrapper,
  TipArrow,
  TipArrowNow,
  Title,
  Time,
  TitleWrapper,
  ItemWrapper,
  ItemTitle,
  ItemContent,
} from './index.style';

export default () => {
  const { currentLang } = useLocale();

  const renderContent = useCallback(
    (item) => {
      const options = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      };
      if (item.percent) {
        options.style = 'percent';
      }
      return (
        <ItemContent>
          {item.needFormat ? (
            <React.Fragment>
              {item.preUnit ? item.preUnit : ''}
              <NumberFormat options={options} lang={currentLang}>
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
              <TipArrow src={pointarrw} alt="icon" />
            </Tooltip>
          </TooltipWrapper>
          <Point src={point} alt="icon" />
        </PointWrapper>
        <PointWrapper>
          <Point src={point} alt="icon" />
          <TooltipWrapper down>
            <Tooltip border>
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
              <TipArrow src={pointarrw} alt="icon" down />
            </Tooltip>
          </TooltipWrapper>
        </PointWrapper>
        <PointWrapper>
          <TooltipWrapper>
            <Tooltip border>
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
              <TipArrow src={pointarrw} alt="icon" />
            </Tooltip>
          </TooltipWrapper>
          <Point src={point} alt="icon" />
        </PointWrapper>
        <PointWrapper>
          <PointNow src={pointnow} alt="icon" />
          <TooltipWrapper down>
            <Tooltip now border>
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
              <TipArrowNow src={pointdashed} alt="icon" />
            </Tooltip>
          </TooltipWrapper>
        </PointWrapper>
      </ArrowLine>
      <Triangle />
    </ArrowWrapper>
  );
};
