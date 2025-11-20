import React, {useCallback, useMemo} from 'react';
import {Text} from 'react-native';
import {getBaseCurrency} from 'site/tenant';
import styled, {css} from '@emotion/native';

import DateTimeFormat from 'components/Common/DateTimeFormat';
import NumberFormat from 'components/Common/NumberFormat';
import {Number, Percent} from 'components/Common/UpOrDownNumber';
import {CLOSE_POSITION_STATUS_TEXT_KEY} from 'constants/businessType';
import {useGetFuturesInfoBySymbol} from 'hooks/useGetFuturesInfoBySymbol';
import {useGetUSDTCurrencyInfo} from 'hooks/useGetUSDTCurrencyInfo';
import useLang from 'hooks/useLang';
import {getDigit} from 'utils/helper';
import {StyledText} from '../styles';
import {useGetPositionSize} from './useGetPositionSize';

const MediumNumberFormat = styled(NumberFormat)`
  font-weight: 500;
`;

export const useMakePositionItems = ({
  positionInfo,
  isHistory,
  isLeadPosition = false,
}) => {
  const {_t} = useLang();
  const {closeQty, symbol, position} = positionInfo;
  const targetSizeValue = isHistory ? closeQty : position;
  const {tickSize} = useGetFuturesInfoBySymbol(symbol);
  const {displayPrecision} = useGetUSDTCurrencyInfo();
  const symbolPrecision = getDigit(tickSize);

  const {baseCurrency, size} = useGetPositionSize({
    symbol,
    value: targetSizeValue,
  });

  const makeCurrentPositionItems = useCallback(() => {
    const {
      avgEntryPrice,
      markPrice,
      liquidationPrice,
      position,
      posMargin,
      closeStatus,
      orderSize,
      extendPositionResponse,
    } = positionInfo;

    // 我的带单当前 仓位 强平价格从extendPositionResponse取
    const posLiquidationPrice = isLeadPosition
      ? extendPositionResponse?.liquidationPrice
      : liquidationPrice;

    return [
      {
        label: _t('96bcd5bf74884000ae72', {symbol: getBaseCurrency()}),
        key: 'averageEntryPrice',
        children: (
          <StyledText>
            <MediumNumberFormat
              options={{
                minimumFractionDigits: symbolPrecision,
                maximumFractionDigits: symbolPrecision,
              }}>
              {avgEntryPrice}
            </MediumNumberFormat>
          </StyledText>
        ),
      },
      {
        label: _t('dfeb9240f7274000a6af'),
        key: 'liquidationPrice',
        children: (
          <StyledText>
            <MediumNumberFormat
              options={{
                minimumFractionDigits: symbolPrecision,
                maximumFractionDigits: symbolPrecision,
              }}>
              {posLiquidationPrice}
            </MediumNumberFormat>
          </StyledText>
        ),
      },
      {
        key: 'markPrice',

        label: _t('0cf3bd64a4094000a170', {symbol: getBaseCurrency()}),
        children: (
          <StyledText>
            <MediumNumberFormat
              options={{
                minimumFractionDigits: symbolPrecision,
                maximumFractionDigits: symbolPrecision,
              }}>
              {markPrice}
            </MediumNumberFormat>
          </StyledText>
        ),
      },
      {
        label: _t('fef449a70bf14000affe', {
          baseCurrency,
        }),
        key: 'positionUSDT',
        children: (
          <StyledText>
            <MediumNumberFormat>{position}</MediumNumberFormat>
            <Text
              style={css`
                font-weight: 500;
              `}>
              /{size}
            </Text>
          </StyledText>
        ),
      },
      {
        key: 'promiseAmount',
        label: _t('6c2a3488c3b04000ad3c', {symbol: getBaseCurrency()}),
        children: (
          <StyledText>
            <MediumNumberFormat
              options={{
                minimumFractionDigits: displayPrecision,
                maximumFractionDigits: displayPrecision,
              }}>
              {posMargin}
            </MediumNumberFormat>
          </StyledText>
        ),
      },
      isLeadPosition && {
        label: _t('271f84be314e4000abb6', {symbol: getBaseCurrency()}),
        key: 'marginUSDT',
        children: (
          <StyledText>
            <MediumNumberFormat
              options={{
                minimumFractionDigits: displayPrecision,
                maximumFractionDigits: displayPrecision,
              }}>
              {orderSize}
            </MediumNumberFormat>
          </StyledText>
        ),
      },
      {
        label: _t('d3443b9ac3d94000a2fd'),
        key: 'positionStatus',
        children: CLOSE_POSITION_STATUS_TEXT_KEY[closeStatus]
          ? _t(CLOSE_POSITION_STATUS_TEXT_KEY[closeStatus])
          : '-',
      },
    ].filter(i => !!i);
  }, [
    _t,
    baseCurrency,
    displayPrecision,
    isLeadPosition,
    positionInfo,
    size,
    symbolPrecision,
  ]);

  const makeHistoryPositionItems = useCallback(() => {
    const {
      pnl,
      pnlRatio,
      closeQty,
      avgEntryPrice,
      avgClosePrice,
      posMargin,
      closeStatus,
      startTime,
      endTime,
    } = positionInfo;

    return [
      {
        label: _t('3b9c1d238d034000a43f', {symbol: getBaseCurrency()}),
        key: 'profitUSDT',
        children: (
          <StyledText>
            <Number
              style={css`
                font-weight: 500;
              `}
              isProfitNumber>
              {pnl}
            </Number>
          </StyledText>
        ),
      },
      {
        label: _t('8ebf0d84dd0a4000ac2d'),
        key: 'profitRate',
        children: (
          <StyledText>
            <Percent
              style={css`
                font-weight: 500;
              `}>
              {pnlRatio}
            </Percent>
          </StyledText>
        ),
      },
      {
        label: _t('6c2a3488c3b04000ad3c', {symbol: getBaseCurrency()}),
        key: 'marginUSDT',
        children: (
          <StyledText>
            <MediumNumberFormat
              options={{
                minimumFractionDigits: displayPrecision,
                maximumFractionDigits: displayPrecision,
              }}>
              {posMargin}
            </MediumNumberFormat>
          </StyledText>
        ),
      },

      {
        label: _t('470664fffed84000a65c', {
          baseCurrency,
        }),
        key: 'closePositionSize',
        children: (
          <StyledText>
            <MediumNumberFormat>{closeQty}</MediumNumberFormat>
            <Text
              style={css`
                font-weight: 500;
              `}>
              /{size}
            </Text>
          </StyledText>
        ),
      },

      {
        label: _t('96bcd5bf74884000ae72', {symbol: getBaseCurrency()}),
        key: 'averageEntryPrice',
        children: (
          <StyledText>
            <MediumNumberFormat
              options={{
                minimumFractionDigits: symbolPrecision,
                maximumFractionDigits: symbolPrecision,
              }}>
              {avgEntryPrice}
            </MediumNumberFormat>
          </StyledText>
        ),
      },
      {
        label: _t('ddb0c60c92df4000ab32', {symbol: getBaseCurrency()}),
        key: 'averageClosedPrice',
        children: (
          <StyledText>
            <MediumNumberFormat
              options={{
                minimumFractionDigits: symbolPrecision,
                maximumFractionDigits: symbolPrecision,
              }}>
              {avgClosePrice}
            </MediumNumberFormat>
          </StyledText>
        ),
      },
      {
        // 历史仓位目前都是完全平仓
        label: _t('fe1eaea44b214000afcf'),
        key: 'hisPositionStatus',
        children: CLOSE_POSITION_STATUS_TEXT_KEY[closeStatus]
          ? _t(CLOSE_POSITION_STATUS_TEXT_KEY[closeStatus])
          : _t('c99a7210c5074000a2e5'),
      },

      {
        label: _t('7a1c85e65c7b4000a764'),
        key: 'averageEntryTime',
        children: (
          <StyledText>
            <DateTimeFormat
              style={css`
                font-weight: 500;
              `}
              options={{
                year: undefined,
                second: undefined,
              }}>
              {startTime}
            </DateTimeFormat>
          </StyledText>
        ),
      },
      {
        label: _t('0c04d3f054144000a8b5'),
        key: 'averageClosedTime',
        children: (
          <StyledText>
            <DateTimeFormat
              style={css`
                font-weight: 500;
              `}
              options={{
                year: undefined,
                second: undefined,
              }}>
              {endTime}
            </DateTimeFormat>
          </StyledText>
        ),
      },
    ];
  }, [_t, baseCurrency, displayPrecision, positionInfo, size, symbolPrecision]);

  const items = useMemo(
    () =>
      !isHistory ? makeCurrentPositionItems() : makeHistoryPositionItems(),
    [isHistory, makeCurrentPositionItems, makeHistoryPositionItems],
  );

  return items;
};
