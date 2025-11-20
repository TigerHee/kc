/*
 * @Owner: Clyne@kupotech.com
 */
import ChangeRender from '@/components/ChangeRender';
import NewTag from '@/components/NewTag';
import PreviewTag from '@/components/PreviewTag';
import StTag from '@/components/StTag';
import SymbolFlag from '@/components/SymbolFlag';
import { isDisplayFeeInfo } from '@/meta/multiTenantSetting';
import AuctionTag from '@/pages/CallAuction/expose/AuctionTag';
import { getSymbolAuctionInfo } from '@/utils/business';
import { useSelector } from 'dva';
import React, { memo, useContext } from 'react';
import SvgComponent from 'src/trade4.0/components/SvgComponent';
import SymbolCodeToName from 'src/trade4.0/components/SymbolCodeToName';
import { isSpotTypeSymbol } from 'src/trade4.0/hooks/common/useIsSpotSymbol';
import { useGetCurrentSymbol, useGetSymbolInfo } from 'src/trade4.0/hooks/common/useSymbol';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { FUTURES, ISOLATED, MARGIN } from 'src/trade4.0/meta/const';
import { formatNumber, toNonExponential } from 'src/trade4.0/utils/format';
import { LIST_TYPE, WrapperContext } from '../../config';
import { useChange } from './hooks/useChange';
import { useFav } from './hooks/useFav';
import { useTabType, useType } from './hooks/useType';
import { Flags, SvgComponentWrapper, widthCfg, widthMSCfg } from './style';

/**
 * 收藏图标
 */
const FavIcon = memo(({ item, tradeType }) => {
  const { isFav, onChange } = useFav(item, tradeType);
  const favColor = isFav ? '#F8B200' : '#8C8C8C';
  const favType = isFav ? 'trade_star_solid' : 'trade_star';
  return (
    <SvgComponent size={12} fileName="markets" color={favColor} type={favType} onClick={onChange} />
  );
});

/**
 * symbol flag
 */
const Flag = ({ item, tradeType }) => {
  const { symbolCode, mark } = item;
  const { isSearch } = useTabType();
  const symbolInfo = useGetSymbolInfo({ symbol: symbolCode });
  const isMargin = tradeType === ISOLATED || tradeType === MARGIN;
  const marginTab = !isSearch && isMargin ? tradeType : undefined;
  // 集合竞价
  const auctionWhiteAllowList = useSelector((state) => state.callAuction.auctionWhiteAllowList);
  const auctionWhiteAllowStatusMap = useSelector(
    (state) => state.callAuction.auctionWhiteAllowStatusMap,
  );
  const { showAuction, previewEnableShow: isPreview } = getSymbolAuctionInfo(
    symbolInfo,
    auctionWhiteAllowList,
    auctionWhiteAllowStatusMap,
  );
  const type = useType();
  // coin不显示
  if (type === LIST_TYPE.COIN) {
    return <></>;
  }
  return (
    <Flags>
      {isDisplayFeeInfo() && <SymbolFlag type={marginTab} symbol={symbolCode} />}
      {isPreview ? (
        <PreviewTag />
      ) : showAuction ? (
        <AuctionTag />
      ) : (
        <React.Fragment>
          {mark === 2 && <NewTag />}
          {mark === 1 && <StTag />}
        </React.Fragment>
      )}
    </Flags>
  );
};

const IconImg = ({ url }) => {
  const iconUrl = '';
  const type = useType();

  if (type === LIST_TYPE.COIN) {
    if (url || iconUrl) {
      return <img className="icon" src={url || iconUrl} alt="" width="20" height="20" />;
    }
  }

  return <></>;
};

const CoinDetail = ({ item }) => {
  const type = useType();
  const { baseCurrency, symbol } = item;
  // coin不显示
  if (type !== LIST_TYPE.COIN || !baseCurrency) {
    return <></>;
  }
  return (
    <div className="coin">
      <div className="currency">{baseCurrency}</div>
      <div className="name">{symbol}</div>
    </div>
  );
};

/**
 * symbol
 */
const SymbolPair = memo(({ item, tradeType }) => {
  const { symbolCode, iconUrl } = item;
  const type = useType();
  const screen = useContext(WrapperContext);
  const isSM = screen === 'sm';
  const symbolStyle = isSM ? { minWidth: widthMSCfg[0] } : { width: widthCfg[0] };
  const isCoin = type === LIST_TYPE.COIN;
  const _tType = tradeType || type;

  return (
    <div className="symbol-pair" style={symbolStyle}>
      <SvgComponentWrapper>
        <FavIcon item={item} tradeType={_tType} />
      </SvgComponentWrapper>
      <IconImg url={iconUrl} />
      <CoinDetail item={item} />
      {!isCoin && (
        <SymbolCodeToName
          isFuturesShowSettle
          dir="ltr"
          code={symbolCode}
          tradeType={_tType}
          isNotWrap={false}
        />
      )}
      <Flag item={item} tradeType={_tType} />
    </div>
  );
});
/**
 * rightItem
 */
const RightItem = ({ item, itemTradeType }) => {
  const { lastTradePrice, changeRate24h, symbolCode } = item;
  const info = useGetSymbolInfo({ symbol: symbolCode, tradeType: itemTradeType });
  const { pricePrecision = 4 } = info;
  const screen = useContext(WrapperContext);
  const isSM = screen === 'sm';
  const LPStyle = isSM ? {} : { width: widthCfg[1] };
  const rateStyle = isSM ? {} : { width: widthCfg[2] };
  return (
    <>
      <div className="symbol-lastprice" style={LPStyle}>
        {formatNumber(toNonExponential(lastTradePrice), {
          pointed: true,
          fixed: pricePrecision,
          dropZ: false,
        })}
      </div>
      <div className="symbol-change" style={rateStyle}>
        <ChangeRender value={changeRate24h} withPrefix={changeRate24h > 0} />
      </div>
    </>
  );
};
/**
 * rightPart
 */
const RightPart = memo(({ item, itemTradeType }) => {
  const screen = useContext(WrapperContext);
  const isSM = screen === 'sm';
  const rightStyle = isSM ? { maxWidth: widthMSCfg[1] } : { width: '50%' };
  if (isSM) {
    return (
      <div className="market-item-r" style={rightStyle}>
        <RightItem item={item} itemTradeType={itemTradeType} />
      </div>
    );
  }
  return <RightItem item={item} itemTradeType={itemTradeType} />;
});

const Item = ({ tradeType, onItemClick, ...item }) => {
  const { symbolCode } = item;
  const currentSymbol = useGetCurrentSymbol();
  const currentTradeType = useTradeType();
  const { getItemTradeType } = useTabType();
  const itemTradeType = getItemTradeType(tradeType);
  const currentClass =
    currentSymbol === symbolCode && currentTradeType === itemTradeType ? 'active' : '';
  const { onClick } = useChange(item, tradeType);
  // fix 由于类型展示不正确的undefine问题
  const type = useType();
  const isCoin = type === LIST_TYPE.COIN;
  const _tType = itemTradeType || type;
  const symbolType = isSpotTypeSymbol(symbolCode);
  // 检验symbolCode根tradeType要完全一致才能显示
  const canShowSymbol = (_tType === FUTURES && !symbolType) || (_tType !== FUTURES && symbolType);
  if (!isCoin && !canShowSymbol) {
    // 虚拟列表没有高度要提示异常
    return <div style={{ height: 44 }} />;
  }
  return (
    <a className={`market-item ${currentClass}`} onClick={onItemClick || onClick}>
      <SymbolPair item={item} tradeType={itemTradeType} />
      <RightPart item={item} itemTradeType={itemTradeType} />
    </a>
  );
};

export default memo(Item);
