/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'dva';
import DetailHold from 'Bot/components/Common/DetailHold';
import OpenOrderPK from 'Bot/components/Common/OpenOrderPK';
import OpenOrderTable from 'Bot/components/Common/OpenOrderTable';
import OpenOrdersStartOk from 'Bot/components/Common/OpenOrdersStartOk';
import useTicker from 'Bot/hooks/useTicker';
import { Text, DashText } from 'Bot/components/Widgets';
import { _t, _tHTML } from 'Bot/utils/lang';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import { formatNumber } from 'Bot/helper';
import Popover from 'Bot/components/Common/Popover';

const modelName = 'martingale';
export default ({ isActive, onClose, runningData: { id, symbol }, mode }) => {
  const open = useSelector((state) => state[modelName].open);
  const CurrentLoading = useSelector((state) => state[modelName].CurrentLoading);
  const symbolInfo = useSpotSymbolInfo(symbol);
  const dispatch = useDispatch();

  const fresh = useCallback(() => {
    dispatch({
      type: `${modelName}/getOpenOrders`,
      payload: {
        taskId: id,
        symbolCode: symbol,
      },
    });
  }, []);
  useTicker(fresh, 'immediately', null, isActive);

  const currencies = open?.currencies || [];

  if (!open.items.length && !CurrentLoading) {
    return (
      <OpenOrdersStartOk
        isActive={isActive}
        title="cbXhFS2FDFvH38PRapki7A"
        desc="pHHb7wwbGc2W7K7FbRVVC3"
      />
    );
  }

  return (
    <div>
      <DetailHold
        currencies={currencies}
        symbolInfo={symbolInfo}
        Append={
          <>
            <Popover placement="top" content={<p className="fs-14">{_tHTML('thisentryPriceHint')}</p>}>
              <DashText fs={12} lh="130%">
                {_t('icR7y4ADodCUhopdk4mbut')}
              </DashText>
            </Popover>
            <Text fs={16} as="div" lh="130%" color="text">
              {formatNumber(open.entryPrice, symbolInfo.pricePrecision)}
            </Text>
          </>
        }
      />
      <OpenOrderPK buyNum={open.buyNum} sellNum={open.sellNum} />
      <OpenOrderTable data={open.items} info={symbolInfo} />
    </div>
  );
};
