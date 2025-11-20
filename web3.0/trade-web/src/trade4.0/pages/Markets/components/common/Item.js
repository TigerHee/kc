/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-12 21:32:47
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-09-27 18:07:46
 * @FilePath: /trade-web/src/trade4.0/pages/Markets/components/common/Item.js
 * @Description:
 */
import ChangeRender from '@/components/ChangeRender';
import NewTag from '@/components/NewTag';
import PreviewTag from '@/components/PreviewTag';
import SeoLink from '@/components/SeoLink';
import StTag from '@/components/StTag';
import SvgComponent from '@/components/SvgComponent';
import SymbolCodeToName from '@/components/SymbolCodeToName';
import SymbolFlag from '@/components/SymbolFlag';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import AuctionTag from '@/pages/CallAuction/expose/AuctionTag';
import { WrapperContext } from '@/pages/Markets/config';
import { FlexColumm } from '@/style/base';
import { styled } from '@/style/emotion';
import { getSymbolAuctionInfo } from '@/utils/business';
import { formatNumber } from '@/utils/format';
import { useSelector } from 'dva';
import React, { useCallback, useContext } from 'react';
import { widthCfg } from '../../style';

const SvgComponentWrapper = styled.div`
  display: flex;
  width: 12px;
  height: 12px;
  margin-right: 5px;
`;

const NoWrapper = styled.div`
  flex-shrink: 0;
`;

const Flags = styled.div`
  display: flex;
`;

const Item = ({ style, index, data }) => {
  const screen = useContext(WrapperContext);
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const auctionWhiteAllowList = useSelector((state) => state.callAuction.auctionWhiteAllowList);
  const auctionWhiteAllowStatusMap = useSelector(
    (state) => state.callAuction.auctionWhiteAllowStatusMap,
  );
  const { marginTab, handleTableRowClick, handleFavClick } = data;
  const item = data.items[index];
  const { lastTradedPrice, precision, symbolCode, changeRate, __isFav } = item;

  const lastTradedPriceValue = formatNumber(lastTradedPrice, {
    pointed: true,
    fixed: precision,
    dropZ: false,
  }).toString();

  const unique = `${symbolCode}-${index}`;
  const symbolInfo = useGetSymbolInfo({ symbol: item.symbolCode });
  // 集合竞价
  const { showAuction, previewEnableShow: isPreview } = getSymbolAuctionInfo(
    symbolInfo,
    auctionWhiteAllowList,
    auctionWhiteAllowStatusMap,
  );
  const handleFavClickCallback = useCallback(
    (e) => {
      handleFavClick(symbolCode, e);
    },
    [symbolCode],
  );

  const handleTableRowClickCall = useCallback(
    (e) => {
      handleTableRowClick(item, e);
    },
    [item],
  );

  return (
    <SeoLink
      key={unique}
      style={style}
      needCheckMarginTab
      symbol={symbolCode}
      onClick={handleTableRowClickCall}
      className={`symbol-item ${currentSymbol === symbolCode ? 'actived' : ''}`}
    >
      <div
        style={{
          width: screen === '400' ? '60%' : widthCfg[0],
          display: 'flex',
          alignItems: 'center',
        }}
        data-item-type="pair"
        className="symbol-pair"
      >
        <SvgComponentWrapper onClick={handleFavClickCallback}>
          <SvgComponent
            size={12}
            fileName="markets"
            color={__isFav ? '#F8B200' : '#8C8C8C'}
            type={__isFav ? 'trade_star_solid' : 'trade_star'}
          />
        </SvgComponentWrapper>
        <NoWrapper>
          <SymbolCodeToName code={symbolCode} />
        </NoWrapper>
        <Flags>
          <SymbolFlag type={marginTab} symbol={symbolCode} />
          {isPreview ? (
            <PreviewTag />
          ) : showAuction ? (
            <AuctionTag />
          ) : (
            <React.Fragment>
              {item.mark === 2 && <NewTag />}
              {item.mark === 1 && <StTag />}
            </React.Fragment>
          )}
        </Flags>
      </div>
      {screen === '400' ? (
        <FlexColumm style={{ width: '40%' }}>
          <div data-item-type="lastprice" className="symbol-lastprice">
            {lastTradedPriceValue}
          </div>
          <div className="symbol-change">
            <ChangeRender value={changeRate} withPrefix={changeRate > 0} />
          </div>
        </FlexColumm>
      ) : (
        <React.Fragment>
          <div
            style={{ width: widthCfg[1] }}
            data-item-type="lastprice"
            className="symbol-lastprice"
          >
            {lastTradedPriceValue}
          </div>
          <div style={{ width: widthCfg[2] }} className="symbol-change">
            <ChangeRender value={changeRate} withPrefix={changeRate > 0} />
          </div>
        </React.Fragment>
      )}
    </SeoLink>
  );
};

export default React.memo(Item);
