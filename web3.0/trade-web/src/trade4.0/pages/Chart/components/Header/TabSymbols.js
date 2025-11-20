/**
 * Owner: jessie@kupotech.com
 */
import ChangingNumber from '@/components/ChangingNumber';
import StTag from '@/components/StTag';
import SvgComponent from '@/components/SvgComponent';
import SymbolCodeToName from '@/components/SymbolCodeToName';
import SymbolText from '@/components/SymbolText';
import { getSymbolInfo } from '@/hooks/common/useSymbol';
import { useLastPrice } from '@/hooks/futures/useMarket';
import usePriceChangeColor from '@/hooks/usePriceChangeColor';
import { FUTURES } from '@/meta/const';
import { AuctionTabTag } from '@/pages/CallAuction/expose/AuctionTag';
import { useKlineSymbols, useSymbolPrice } from '@/pages/Chart/hooks/useKlineSymbols';
import { getSymbolAuctionInfo } from '@/utils/business';
import { formatNumber, toNonExponential } from '@/utils/format';
import { shallowEqual, useDispatch, useSelector } from 'dva';
import { isNil, map } from 'lodash';
import React, { memo, useEffect, useMemo } from 'react';
import SettleDateTip from 'src/trade4.0/pages/Futures/components/SettleDateTip/SettleDateTip';
import { Item, ItemWrapper, SymbolsWrapper } from './style';

const SymbolContent = memo(({ tagInfo, price, symbolName, mark }) => {
  const priceChangeColor = usePriceChangeColor();

  return (
    <Item>
      <span className="name">
        {symbolName()}
        {mark === 1 && (
          <span className="st">
            <StTag />
          </span>
        )}
      </span>
      <ChangingNumber value={price} {...priceChangeColor} showIcon={false} showBgArea={false}>
        {tagInfo ||
          (isNil(price) ? '--' : price ? `${formatNumber(toNonExponential(price))}` : '0')}
      </ChangingNumber>
    </Item>
  );
});

const SymbolItem = memo(({ symbol }) => {
  const dispatch = useDispatch();
  const { mark } = getSymbolInfo({ symbol });
  const { lastTradedPrice } = useSymbolPrice({ symbol });
  const symbolsMap = useSelector((state) => state.symbols.symbolsMap, shallowEqual);
  const auctionWhiteAllowList = useSelector(
    (state) => state.callAuction.auctionWhiteAllowList,
    shallowEqual,
  );
  const auctionWhiteAllowStatusMap = useSelector(
    (state) => state.callAuction.auctionWhiteAllowStatusMap,
    shallowEqual,
  );
  const isLogin = useSelector((state) => state.user.isLogin);
  useEffect(() => {
    // 登陆且有开启白名单的symbol再查询用户白名单状态
    if (isLogin && symbol && auctionWhiteAllowList?.includes(symbol)) {
      dispatch({
        type: 'callAuction/getAuctionWhiteStatus',
        payload: {
          symbol,
        },
      });
    }
  }, [dispatch, symbol, isLogin, auctionWhiteAllowList]);

  const { showAuction } = getSymbolAuctionInfo(
    symbolsMap[symbol],
    auctionWhiteAllowList,
    auctionWhiteAllowStatusMap,
  );

  const tagInfo = useMemo(() => {
    if (showAuction) {
      return <AuctionTabTag />;
    }
  }, [showAuction]);

  return (
    <SymbolContent
      tagInfo={tagInfo}
      price={lastTradedPrice}
      symbolName={() => <SymbolCodeToName code={symbol} />}
      mark={mark}
    />
  );
});

const FuturesSymbolItem = memo(({ symbol }) => {
  const lastPrice = useLastPrice(symbol);
  return (
    <SymbolContent
      price={lastPrice}
      symbolName={() => (
        <div className="futures-symbol">
          <SettleDateTip symbol={symbol} showText={false} largeIcon />
          <SymbolText symbol={symbol} />
        </div>
      )}
    />
  );
});

export default () => {
  const { onSymbolChange, onDeleteSymbol, kLineSymbols, activeIndex } = useKlineSymbols();
  return (
    <SymbolsWrapper className="no-scrollbar">
      {map(kLineSymbols, (item, index) => {
        if (item?.symbol) {
          return (
            <ItemWrapper
              symbol={item.symbol}
              style={{ minWidth: `${100 / kLineSymbols.length}%` }}
              key={`${item.symbol}_${index}`}
              className={item.displayIndex === activeIndex ? 'active' : ''}
              onClick={() => onSymbolChange(item.symbol)}
            >
              {item.tradeType === FUTURES ? (
                <FuturesSymbolItem symbol={item.symbol} />
              ) : (
                <SymbolItem symbol={item.symbol} />
              )}

              {kLineSymbols.length !== 1 ? (
                <SvgComponent
                  type="close"
                  size={16}
                  onClick={(e) => onDeleteSymbol(e, item.symbol)}
                />
              ) : null}
            </ItemWrapper>
          );
        }
      })}
    </SymbolsWrapper>
  );
};
