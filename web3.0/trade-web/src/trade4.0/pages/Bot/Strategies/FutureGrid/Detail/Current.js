/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import { DetailHoldTemp } from 'Bot/components/Common/DetailHold';
import OpenOrderPK from 'Bot/components/Common/OpenOrderPK';
import OpenOrderTable from 'Bot/components/Common/OpenOrderTable';
import OpenOrdersStartOk from 'Bot/components/Common/OpenOrdersStartOk';
import OpenOrdersLimit from 'Bot/components/Common/OpenOrdersLimit';
import useTicker from 'Bot/hooks/useTicker';
import { formatNumber, floatText, floatToPercent } from 'Bot/helper';
import { useSelector, useDispatch } from 'dva';
import { _t, _tHTML } from 'Bot/utils/lang';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
import FutureTag from 'Bot/components/Common/FutureTag';
import Decimal from 'decimal.js';
import styled from '@emotion/styled';
import { handleNum } from 'Bot/utils/util';

const MFutureTag = styled(FutureTag)`
  width: fit-content;
  margin: 0 auto;
`;

const DetailHold = ({ open }) => {
  const { currentQty, direction = 'short', leverage, fundingRate } = open;
  const columns = [
    {
      label: _t('futrgrid.kaidirection'),
      value: <MFutureTag as="div" direction={direction} leverage={leverage} noBk fs={16} />,
    },
    {
      label: `${_t('futrgrid.chichangnum')}(${_t('futrgrid.zhang')})`,
      value: formatNumber(currentQty ?? 0),
    },
    {
      label: _t('futrgrid.fundingrate'),
      value: fundingRate ? floatToPercent(fundingRate) : '--',
    },
  ];
  return <DetailHoldTemp columns={columns} />;
};

export default ({ isActive, onClose, runningData: { id, symbolCode, status }, mode }) => {
  const symbolInfo = useFutureSymbolInfo(symbolCode);
  const { precision, quote } = symbolInfo;
  const open = useSelector((state) => state.futuregrid.open);
  const CurrentLoading = useSelector((state) => state.futuregrid.CurrentLoading);
  const dispatch = useDispatch();
  const fresh = useCallback(() => {
    dispatch({
      type: 'futuregrid/getOpenOrders',
      payload: {
        taskId: id,
        symbol: symbolCode,
      },
    });
  }, []);
  useTicker(fresh, 'immediately', null, isActive);

  const [buyNum, sellNum] = handleNum(open);

  if (!open.items.length && !CurrentLoading && status !== 'RISK_PROTECTION') {
    return <OpenOrdersStartOk isActive={isActive} />;
  }

  return (
    <div>
      <DetailHold open={open} />
      {status === 'RISK_PROTECTION' ? (
        <OpenOrdersLimit isActive={isActive} />
      ) : (
        <>
          <OpenOrderPK
            buyNum={buyNum}
            sellNum={sellNum}
            currentPrice={`${formatNumber(open.currentPrice ?? 0, precision)} ${quote}`}
          />
          <OpenOrderTable
            data={open.items}
            info={{
              base: _t('futrgrid.zhang'),
              quota: symbolInfo.quota,
              pricePrecision: symbolInfo.precision,
              basePrecision: 0,
            }}
          />
        </>
      )}
    </div>
  );
};
