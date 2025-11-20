/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import OpenOrderPK from 'Bot/components/Common/OpenOrderPK';
import OpenOrderTable from 'Bot/components/Common/OpenOrderTable';
import OpenOrdersStartOk from 'Bot/components/Common/OpenOrdersStartOk';
import OpenOrdersLimit from 'Bot/components/Common/OpenOrdersLimit';
import useTicker from 'Bot/hooks/useTicker';
import { useSelector, useDispatch } from 'dva';
import { _t, _tHTML } from 'Bot/utils/lang';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import FutureTag from 'Bot/components/Common/FutureTag';
import styled from '@emotion/styled';
import { handleNum } from 'Bot/utils/util';
import DetailHold from 'Bot/components/Common/DetailHold';
import { Text } from 'Bot/components/Widgets';

const MFutureTag = styled(FutureTag)`
  width: fit-content;
  margin: 0 auto;
`;

/**
 * @description: 将后端给的对象转成 前端通用显示的格式
 * @param {object} position
 * @param {object} symbolInfo
 * @return {array}
 */
const transferCurrencies = (position, symbolInfo) => {
  const { cbase, cquota } = symbolInfo;
  return [
    {
      currency: cbase,
      totalBalance: position?.basePosition,
    },
    {
      currency: cquota,
      totalBalance: position?.quotaPosition,
    },
  ];
};
export default ({ isActive, onClose, runningData: { id, symbol, status }, mode }) => {
  const symbolInfo = useSpotSymbolInfo(symbol);
  const open = useSelector((state) => state.leveragegrid.open);
  const position = useSelector((state) => state.leveragegrid.position);
  const CurrentLoading = useSelector((state) => state.leveragegrid.CurrentLoading);
  const dispatch = useDispatch();
  const fresh = useCallback(() => {
    dispatch({
      type: 'leveragegrid/getOrder',
      payload: {
        taskId: id,
      },
    });
  }, []);
  useTicker(fresh, 'immediately', null, isActive);

  const [buyNum, sellNum] = handleNum(open);
  const currencies = transferCurrencies(position, symbolInfo);
  if (!open.items.length && !CurrentLoading && status !== 'RISK_PROTECTION') {
    return <OpenOrdersStartOk isActive={isActive} />;
  }

  return (
    <div>
      <DetailHold
        currencies={currencies}
        symbolInfo={symbolInfo}
        Prepend={
          <>
            <Text color="text60" fs={12} lh="130%">
              {_t('futrgrid.kaidirection')}
            </Text>
            <MFutureTag
              as="div"
              direction={position.direction}
              leverage={position.leverage}
              noBk
              fs={16}
            />
          </>
        }
      />

      {status === 'RISK_PROTECTION' ? (
        <OpenOrdersLimit isActive={isActive} />
      ) : (
        <>
          <OpenOrderPK buyNum={buyNum} sellNum={sellNum} />
          <OpenOrderTable data={open.items} info={symbolInfo} />
        </>
      )}
    </div>
  );
};
