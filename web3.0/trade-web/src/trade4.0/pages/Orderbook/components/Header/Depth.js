/*
 * owner: Clyne@kupotech.com
 */
import React from 'react';
import { useSelector, useDispatch } from 'dva';
import DropdownSelect from '@/components/DropdownSelect';
import { namespace, ORDER_BOOK_LADDER_STORAGE_KEY } from '@/pages/Orderbook/config';
import { useEvent } from '@/pages/Orderbook/hooks/useEvent';
import { DepthWrapper, DropdownExtend } from './style';
import { getSymbolAuctionInfo } from '@/utils/business';
import { commonSensorsFunc } from '@/meta/sensors';
import storage from 'src/utils/storage';
import { resetScroll } from '../List/hooks/useList';

const Depth = () => {
  const dispatch = useDispatch();
  const depthConfig = useSelector((state) => state[namespace].depthConfig);
  const currentDepth = useSelector((state) => state[namespace].currentDepth);
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const symbolsMap = useSelector((state) => state.symbols.symbolsMap);
  const auctionWhiteAllowList = useSelector((state) => state.callAuction.auctionWhiteAllowList);
  const auctionWhiteAllowStatusMap = useSelector(
    (state) => state.callAuction.auctionWhiteAllowStatusMap,
  );
  const { showAuction } = getSymbolAuctionInfo(
    symbolsMap?.[currentSymbol],
    auctionWhiteAllowList,
    auctionWhiteAllowStatusMap,
  );

  const {
    onDepthChange = async (v) => {
      commonSensorsFunc(['orderBook', 'orderBookDepthChange', 'click']);
      const payload = {
        currentSymbol,
        currentDepth: v,
        showAuction,
      };
      await dispatch({
        type: `${namespace}/update`,
        payload: {
          currentDepth: v,
        },
      });
      // 切换时初始化买卖盘
      await dispatch({
        type: `${namespace}/getOrderBooks`,
        payload,
      });
      // 更新缓存
      const storageValue = storage.getItem(ORDER_BOOK_LADDER_STORAGE_KEY) || {};
      storage.setItem(ORDER_BOOK_LADDER_STORAGE_KEY, { ...storageValue, [currentSymbol]: v });
      resetScroll(200);
    },
  } = useEvent(dispatch);
  return (
    <DepthWrapper className="orderbook-depth" data-inspector="trade-orderbook-depth">
      <DropdownSelect
        extendStyle={DropdownExtend}
        configs={depthConfig}
        value={currentDepth}
        onChange={onDepthChange}
        popperClassName="depth-dropdown"
      />
    </DepthWrapper>
  );
};
export default Depth;
