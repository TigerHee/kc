/**
 * Owner: garuda@kupotech.com
 * 展示最大可下单手数
 */

import React, { useMemo, memo, useState, useEffect, useCallback } from 'react';

import Decimal from 'decimal.js';

import Spin from '@mui/Spin';

import {
  withYScreen,
  _t,
  multiply,
  evtEmitter,
  styled,
  thousandPointed,
  MARGIN_MODE_ISOLATED,
  calcCrossMaxOrder,
  lessThan,
} from '../../builtinCommon';

import {
  useCrossTotalMargin,
  useFuturesTakerFee,
  useMarginMode,
  useShowAbnormal,
} from '../../builtinHooks';
import { BUY, SELL, USDS_MIN_VALUE, useFuturesForm } from '../../config';
import { calculatorDealPrice } from '../../formula';
import {
  useGetAvailableBalance,
  getPositionSize,
  useGetActiveTab,
  useGetBBO,
  useGetFeeRate,
  useGetLeverage,
  useGetSymbolInfo,
  useGetUnit,
} from '../../hooks/useGetData';
import useIsMobile from '../../hooks/useIsMobile';

import useWrapperScreen from '../../hooks/useWrapperScreen';
import { makeAvailableToSize } from '../../utils';
import { logicThis } from '../commonStyle';
import PrettySize from '../PrettySize';

const MaxOrderSizeWrapper = withYScreen(styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  margin-bottom: ${(props) => (!props.pcMedia ? '12px' : 0)};
  ${(props) =>
    props.$useCss(['md', 'sm'])(`
    margin-top: 5px;
  `)}
`);

const SizeItem = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
  text-align: left;
  font-size: 12px;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text40};
  ${(props) => logicThis(props.isSell)} {
    justify-content: flex-end;
    text-align: right;
    width: ${(props) => (props.isMd ? '100%' : 'auto')};
  }
`;

const SizeLabel = styled.span`
  margin-right: 2px;
`;

const PrettySizeBold = styled(PrettySize)`
  color: ${(props) => props.theme.colors.text};
`;

const MaxOrderValue = styled.span`
  color: ${(props) => props.theme.colors.text};
`;

const MaxOrderNumberValue = styled.span`
  color: ${(props) => props.theme.colors.text};
`;

const event = evtEmitter.getEvt('trade-orderInfo');

const OrderItem = memo(({ isLong, isMd, expectedSize, orderPrice, expectPrice }) => {
  const { chooseUSDsUnit } = useGetUnit();
  const { symbolInfo } = useGetSymbolInfo();
  const [loading, setLoading] = useState(false);

  const handleChangeLoading = useCallback((v) => {
    setLoading(v);
  }, []);

  useEffect(() => {
    event.on('KM@setDefaultLastPrice', handleChangeLoading);
    return () => {
      event.off('KM@setDefaultLastPrice', handleChangeLoading);
    };
  }, [handleChangeLoading]);

  const showUSDsValue = useMemo(() => {
    let uSDsValue = 0;
    if (chooseUSDsUnit && expectedSize && expectPrice && !symbolInfo?.isInverse) {
      if (expectedSize === '-' || expectedSize === '--') return expectedSize;
      // 显示可买入，
      // 可买入数量 按比例填入值的时候公式为 张数 * 合约乘数 * 价格 = 显示出的usdt数量
      // expectedSize 未乘以合约乘数，所以这里都乘以
      // makeAvailableToSize 中 needTrans 为false
      uSDsValue = multiply(multiply(expectedSize)(orderPrice || 0))(symbolInfo?.multiplier)
        .toNearest(USDS_MIN_VALUE, Decimal.ROUND_UP)
        .toNumber();
    }
    return uSDsValue;
  }, [chooseUSDsUnit, expectPrice, expectedSize, orderPrice, symbolInfo]);

  return (
    <SizeItem isSell={!isLong} isMd={isMd}>
      <SizeLabel>{_t(isLong ? 'long.expectSize' : 'short.expectSize')}</SizeLabel>
      {loading ? (
        <Spin spinning size="small" />
      ) : (
        <>
          {chooseUSDsUnit && !symbolInfo?.isInverse ? (
            <MaxOrderValue>
              <MaxOrderNumberValue>{thousandPointed(showUSDsValue)}</MaxOrderNumberValue>
              {` ${symbolInfo?.quoteCurrency}`}
            </MaxOrderValue>
          ) : (
            <PrettySizeBold value={expectedSize} fix formatProps={{ round: Decimal.ROUND_DOWN }} />
          )}
        </>
      )}
    </SizeItem>
  );
});

const IsolatedOrderSizeItem = memo(
  ({ isLong, lev, expectPrice, closeOnly, contract, tradingUnit, orderPrice, isMd }) => {
    const { fixTakerFee } = useGetFeeRate();

    const availableBalance = useGetAvailableBalance();

    const { isInverse, multiplier, lotSize, maxOrderQty, symbol } = contract;

    const takerFeeRate = useFuturesTakerFee({ symbol });

    let expectedSize = 0;
    const positionSize = getPositionSize();
    const isPositionSell = lessThan(positionSize)(0);

    if (expectPrice) {
      // 如果只减仓勾选，则按照仓位数量更新百分比
      if (closeOnly) {
        if (isPositionSell && !isLong) {
          expectedSize = 0;
        } else {
          expectedSize = Math.abs(positionSize);
        }
      } else {
        expectedSize = makeAvailableToSize({
          ratio: 1,
          expectPrice,
          isInverse,
          multiplier,
          lev,
          fixTakerFee,
          takerFeeRate,
          lotSize,
          availableBalance,
          maxOrderQty,
          tradingUnit,
          positionSize,
          isLong,
          needTrans: false,
        });
      }
    }
    return (
      <OrderItem
        isLong={isLong}
        isMd={isMd}
        expectPrice={expectPrice}
        orderPrice={orderPrice}
        expectedSize={expectedSize}
      />
    );
  },
);

const CrossOrderSizeItem = memo(
  ({ closeOnly, leverage, expectPrice, orderPrice, isLong, isMd }) => {
    // const { takerFeeRate } = useGetFeeRate();
    const { symbolInfo } = useGetSymbolInfo();

    const totalMargin = useCrossTotalMargin(symbolInfo?.settleCurrency);
    const showAbnormal = useShowAbnormal();

    const takerFeeRate = useFuturesTakerFee({ symbol: symbolInfo?.symbol });
    let expectedSize = 0;
    const positionSize = getPositionSize();
    const isPositionSell = lessThan(positionSize)(0);
    // 如果只减仓勾选，则按照仓位数量更新百分比
    if (closeOnly) {
      if (isPositionSell && !isLong) {
        expectedSize = 0;
      } else {
        expectedSize = positionSize ? Math.abs(positionSize) : '--';
      }
    } else {
      expectedSize = calcCrossMaxOrder({
        symbolInfo,
        totalMargin,
        leverage,
        price: expectPrice,
        takerFeeRate,
        isLong,
      });
      const abnormalResult = showAbnormal();
      if (abnormalResult) {
        expectedSize = abnormalResult;
      }
    }

    return (
      <OrderItem
        isLong={isLong}
        isMd={isMd}
        expectPrice={expectPrice}
        orderPrice={orderPrice}
        expectedSize={expectedSize}
      />
    );
  },
);

const MaxOrderSize = ({ price, closeOnly }) => {
  const { chooseUSDsUnit, tradingUnit } = useGetUnit();
  const { symbolInfo } = useGetSymbolInfo();
  const { ask1, bid1 } = useGetBBO();
  const { orderType: type } = useGetActiveTab();
  const lev = useGetLeverage();

  const dealPrices = useMemo(() => {
    if (!price) return [0];
    return calculatorDealPrice({
      symbolInfo,
      type,
      price: price || 0,
      ask1,
      bid1,
    });
  }, [ask1, bid1, symbolInfo, price, type]);

  const isMobile = useIsMobile();
  const { isMd } = useWrapperScreen();
  const futuresFormContext = useFuturesForm();

  const { getMarginModeForSymbol } = useMarginMode();
  const isIsolated = useMemo(
    () => getMarginModeForSymbol(symbolInfo?.symbol) === MARGIN_MODE_ISOLATED,
    [getMarginModeForSymbol, symbolInfo],
  );

  return (
    <MaxOrderSizeWrapper pcMedia={!isMobile} isMd={isMd}>
      {isMd && futuresFormContext?.side === SELL ? null : isIsolated ? (
        <IsolatedOrderSizeItem
          isLong
          lev={lev}
          expectPrice={dealPrices[0]}
          closeOnly={closeOnly}
          contract={symbolInfo}
          tradingUnit={tradingUnit}
          chooseUSDsUnit={chooseUSDsUnit}
          isMd={isMd}
          orderPrice={price}
        />
      ) : (
        <CrossOrderSizeItem
          closeOnly={closeOnly}
          expectPrice={dealPrices[0]}
          leverage={lev}
          isLong
          isMd={isMd}
          tradingUnit={tradingUnit}
          orderPrice={price}
        />
      )}
      {isMd && futuresFormContext?.side === BUY ? null : isIsolated ? (
        <IsolatedOrderSizeItem
          isLong={false}
          lev={lev}
          expectPrice={dealPrices[1]}
          closeOnly={closeOnly}
          contract={symbolInfo}
          tradingUnit={tradingUnit}
          chooseUSDsUnit={chooseUSDsUnit}
          isMd={isMd}
          orderPrice={price}
        />
      ) : (
        <CrossOrderSizeItem
          closeOnly={closeOnly}
          expectPrice={dealPrices[1]}
          leverage={lev}
          isLong={false}
          isMd={isMd}
          orderPrice={price}
        />
      )}
    </MaxOrderSizeWrapper>
  );
};

export default memo(MaxOrderSize);
