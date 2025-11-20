/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'dva';
import OpenOrderPK from 'Bot/components/Common/OpenOrderPK';
import OpenOrderTable from 'Bot/components/Common/OpenOrderTable';
import OpenOrdersStartOk from 'Bot/components/Common/OpenOrdersStartOk';
import useTicker from 'Bot/hooks/useTicker';
import { Text, DashText } from 'Bot/components/Widgets';
import { _t, _tHTML } from 'Bot/utils/lang';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
import { formatNumber } from 'Bot/helper';
import Popover from 'Bot/components/Common/Popover';
import { DetailHoldTemp } from 'Bot/components/Common/DetailHold';
import FutureTag from 'Bot/components/Common/FutureTag';
import { handleNum } from 'Bot/utils/util';
import styled from '@emotion/styled';

const MFutureTag = styled(FutureTag)`
  width: fit-content;
  margin: 0 auto;
`;
const DetailHold = ({ open, symbolInfo }) => {
  const { positionQty, direction = 'short', leverage, entryPrice } = open;
  const columns = [
    {
      label: _t('futrgrid.kaidirection'),
      value: <MFutureTag as="div" direction={direction} leverage={leverage} noBk fs={16} />,
    },
    {
      label: `${_t('futrgrid.chichangnum')}(${_t('futrgrid.zhang')})`,
      value: formatNumber(positionQty ?? 0),
    },
    {
      label: (
        <Popover placement="top" content={<p className="fs-14">{_t('thisentryPriceHint')}</p>}>
          <DashText fs={12} lh="130%">
            {_t('icR7y4ADodCUhopdk4mbut')}
          </DashText>
        </Popover>
      ),
      value: entryPrice ? formatNumber(entryPrice, symbolInfo.precision) : '--',
    },
  ];
  return <DetailHoldTemp columns={columns} />;
};
const modelName = 'futuremartingale';
export default ({ isActive, onClose, runningData: { id, symbolCode }, mode }) => {
  const open = useSelector((state) => state[modelName].open);
  const CurrentLoading = useSelector((state) => state[modelName].CurrentLoading);
  const symbolInfo = useFutureSymbolInfo(symbolCode);
  const dispatch = useDispatch();

  const fresh = useCallback(() => {
    dispatch({
      type: `${modelName}/getOpenOrders`,
      payload: {
        taskId: id,
        symbolCode,
      },
    });
  }, []);
  useTicker(fresh, 'immediately', null, isActive);

  handleNum(open);

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
      <DetailHold open={open} symbolInfo={symbolInfo} />
      <OpenOrderPK buyNum={open.buyNum} sellNum={open.sellNum} />
      <OpenOrderTable
        data={open.items}
        info={{
          base: _t('futrgrid.zhang'),
          quota: symbolInfo.quota,
          pricePrecision: symbolInfo.precision,
          basePrecision: 0,
        }}
      />
    </div>
  );
};
