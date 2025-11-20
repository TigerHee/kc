/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, Divider, NumberFormat, useResponsive } from '@kux/mui';
import { dateTimeFormat } from '@kux/mui/utils';
import Tooltip from 'components/Premarket/components/Tooltip';
import { useActivityItemStatus } from 'components/Premarket/hooks';
import { divide, transStepToPrecision } from 'helper';
import { memo, useCallback, useMemo } from 'react';
import { _t } from 'tools/i18n';
import { locateToTrade, locateToUrl } from 'TradeActivity/utils';
import CoinInfo from './CoinInfo';
import {
  BottomDataWrapper,
  ButtonWrapper,
  DataValueWrapper,
  DataWrapper,
  HistoryWrapper,
  LeftWrapper,
  OngoingWrapper,
  PercentWrapper,
  PlaceholderWrapper,
  RightWrapper,
  StyledCardItem,
} from './styledComponents';
import TimeStatus from './TimeStatus';

const DataItem = memo(({ value, percent, valueFormatOption }) => {
  const { currentLang } = useLocale();

  if (!value) {
    return <PlaceholderWrapper>--</PlaceholderWrapper>;
  }
  return (
    <DataValueWrapper>
      <NumberFormat lang={currentLang} options={valueFormatOption}>
        {value}
      </NumberFormat>
      {!!percent && (
        <PercentWrapper className={percent > 0 ? 'primary' : percent < 0 ? 'secondary' : ''}>
          (
          <NumberFormat
            options={{
              style: 'percent',
              // minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }}
            lang={currentLang}
            isPositive={+percent !== 0}
          >
            {divide(percent || '0', 100)}
          </NumberFormat>
          )
        </PercentWrapper>
      )}
    </DataValueWrapper>
  );
});

export default function CardItem({
  logo,
  fullName,
  shortName,
  introDetail,
  displayLabel,
  tradeStartAt,
  tradeEndAt,
  displayTradeEndAt,
  deliveryTime,
  priceIncrement,
  lastTradePrice,
  changeRate,
  avgPrice,
  dayVol,
  totalVol,
  offerCurrency,
  symbolCode,
}) {
  const { currentLang } = useLocale();
  const { sm, lg } = useResponsive();
  const activityStatus = useActivityItemStatus({ tradeStartAt, tradeEndAt, deliveryTime });

  const DataInfo = useMemo(() => {
    return (
      <DataWrapper>
        {activityStatus !== 3 ? (
          <>
            <div className="dataItem">
              <Tooltip title={_t('najm2ZBhumtQsRDRTJPLsR')}>
                <div className="label hasDes">{`${_t('mY7CdPaQz25Gej7Z2wq93A')} (${
                  offerCurrency || ''
                })`}</div>
              </Tooltip>
              <div className="value">
                <DataItem
                  value={lastTradePrice}
                  valueFormatOption={{
                    maximumFractionDigits: transStepToPrecision(priceIncrement),
                    roundingMode: 'floor',
                  }}
                  percent={changeRate}
                />
              </div>
            </div>
            <div className="dataItem">
              <div className="label">{_t('55c18a032d314000a5f5', { currency: offerCurrency })}</div>
              <div className="value">
                <DataItem
                  value={dayVol}
                  valueFormatOption={{
                    maximumFractionDigits: 0,
                    roundingMode: 'floor',
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="dataItem">
              <Tooltip title={_t('4fbRb5h36VtFb3ywbRWkF2')}>
                <div className="label hasDes">{`${_t('23LB2Vd8LXj7LiKmfzMwRm')} (${
                  offerCurrency || ''
                })`}</div>
              </Tooltip>
              <div className="value">
                <DataItem
                  value={lastTradePrice}
                  valueFormatOption={{
                    maximumFractionDigits: transStepToPrecision(priceIncrement),
                    roundingMode: 'floor',
                  }}
                />
              </div>
            </div>
            <div className="dataItem">
              <Tooltip title={_t('g6nc9rdZHefyTGaYjm3zbE')}>
                <div className="label hasDes">{`${_t('wRWkH78Api3bn24R4B3MtD')} (${
                  offerCurrency || ''
                })`}</div>
              </Tooltip>
              <div className="value">
                <DataItem value={avgPrice} />
              </div>
            </div>
          </>
        )}

        <div className="dataItem">
          <div className="label">{_t('b3128da7d6494000a2c4', { currency: offerCurrency })}</div>
          <div className="value">
            <DataItem
              value={totalVol}
              valueFormatOption={{
                maximumFractionDigits: 0,
                roundingMode: 'floor',
              }}
            />
          </div>
        </div>
      </DataWrapper>
    );
  }, [
    activityStatus,
    avgPrice,
    changeRate,
    dayVol,
    lastTradePrice,
    offerCurrency,
    priceIncrement,
    totalVol,
  ]);

  const handleToDetail = useCallback(
    (e) => {
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();
      locateToUrl(`/pre-market/${shortName}`);
    },
    [shortName],
  );
  // 已完成跳转到交易
  const handleToTrade = useCallback(
    (e) => {
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();
      locateToTrade(symbolCode);
    },
    [symbolCode],
  );

  return (
    <StyledCardItem onClick={!sm ? handleToDetail : undefined}>
      <LeftWrapper>
        <CoinInfo
          logo={logo}
          fullName={fullName}
          shortName={shortName}
          introDetail={introDetail}
          displayLabel={activityStatus < 3 ? displayLabel : null}
        />
        {!sm && (
          <TimeStatus
            tradeStartAt={tradeStartAt}
            tradeEndAt={tradeEndAt}
            displayTradeEndAt={displayTradeEndAt}
            deliveryTime={deliveryTime}
          />
        )}
      </LeftWrapper>
      {lg && <div className="divider" />}
      <RightWrapper>
        {activityStatus !== 3 ? (
          <OngoingWrapper>
            {sm && (
              <TimeStatus
                tradeStartAt={tradeStartAt}
                tradeEndAt={tradeEndAt}
                displayTradeEndAt={displayTradeEndAt}
                deliveryTime={deliveryTime}
              />
            )}

            <div className="dataWrapper">
              {DataInfo}
              {sm && (
                <ButtonWrapper>
                  <Button
                    onClick={handleToDetail}
                    variant={activityStatus === 1 ? 'contained' : 'outlined'}
                  >
                    {activityStatus === 1 ? _t('56c7890db2b64000a5e9') : _t('details')}
                  </Button>
                </ButtonWrapper>
              )}
            </div>
          </OngoingWrapper>
        ) : sm ? (
          <HistoryWrapper>
            {DataInfo}

            <div className="timeWrapper">
              <TimeStatus
                tradeStartAt={tradeStartAt}
                tradeEndAt={tradeEndAt}
                displayTradeEndAt={displayTradeEndAt}
                deliveryTime={deliveryTime}
              />
              <ButtonWrapper>
                {symbolCode && (
                  <Button onClick={handleToTrade}>{_t('56c7890db2b64000a5e9')}</Button>
                )}
                <Button onClick={handleToDetail} variant="outlined">
                  {_t('details')}
                </Button>
              </ButtonWrapper>
            </div>
          </HistoryWrapper>
        ) : null}
        {!sm && (
          <>
            {activityStatus !== 3 && <Divider className="hr" />}
            <BottomDataWrapper>
              <div className="dataItem">
                <div className="label">{_t('n27sNg1ZzL4wFyCKkiaDPV')}</div>
                <div className="value">
                  {`${dateTimeFormat({
                    date: +tradeStartAt * 1000,
                    lang: currentLang,
                    options: { timeZone: 'UTC', second: undefined },
                  })} - ${
                    displayTradeEndAt
                      ? dateTimeFormat({
                          date: +tradeEndAt * 1000,
                          lang: currentLang,
                          options: { timeZone: 'UTC', second: undefined },
                        })
                      : _t('fDfqjRaCNVa226rPjxEA5o')
                  }${_t('wMm9D9jK8iibsKRZrPbiQ8')}`}
                </div>
              </div>
              {activityStatus === 3 && symbolCode && (
                <Button onClick={handleToTrade} size="small">
                  {_t('56c7890db2b64000a5e9')}
                </Button>
              )}
            </BottomDataWrapper>
          </>
        )}
      </RightWrapper>
    </StyledCardItem>
  );
}
