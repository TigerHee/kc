/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import DetailHold from 'Bot/components/Common/DetailHold';
import OpenOrderPK from 'Bot/components/Common/OpenOrderPK';
import OpenOrderTable from 'Bot/components/Common/OpenOrderTable';
import OpenOrdersStartOk from 'Bot/components/Common/OpenOrdersStartOk';
import useTicker from 'Bot/hooks/useTicker';
import EntryPrice from 'Bot/Strategies/ClassicGrid/components/EntryPrice';
import { Text } from 'Bot/components/Widgets';
import { _t, _tHTML } from 'Bot/utils/lang';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import { formatNumber } from 'Bot/helper';
// import OpenOrdersLimit from 'Bot/components/Common/OpenOrdersLimit';

export default ({ isActive, onClose, runningData: { id, symbol }, mode, modelName }) => {
  const open = useSelector((state) => state[modelName].open);
  const params = useSelector((state) => state[modelName].runParams);
  const CurrentLoading = useSelector((state) => state[modelName].CurrentLoading);
  const symbolInfo = useSpotSymbolInfo(symbol);
  const { base, quota, pricePrecision } = symbolInfo;
  const dispatch = useDispatch();
  // 现货网格暂停中 不能修改
  useLayoutEffect(() => {
    dispatch({
      type: `${modelName}/getParameter`,
      payload: {
        id,
      },
    });
  }, []);
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
  // 入场价格 显示横线 弹窗
  const EntryPriceHold = (
    <>
      <Text color="text60" fs={12}>
        {_t('card14')}
      </Text>
      <EntryPrice
        className="fs-16"
        direction="row-reverse"
        value={open.entryPrice}
        pricePrecision={pricePrecision}
        isUpdate={open.hasEntryPriceHis}
        taskId={id}
        as="div"
      />
    </>
  );
  // return <OpenOrdersLimit isActive={isActive} />;
  // return <OpenOrdersStartOk isActive={isActive} />;
  if (!open.items.length && !CurrentLoading && open.taskStatus !== 'PAUSED') {
    return <OpenOrdersStartOk isActive={isActive} />;
  }

  return (
    <div>
      <DetailHold currencies={currencies} symbolInfo={symbolInfo} Append={EntryPriceHold} />
      {open.taskStatus === 'PAUSED' ? (
        <Text className="center pt-60" as="div" color="complementary" fs={16}>
          {_tHTML('jKiC3UEsXKM3ANVgyr4shd', {
            base,
            quota: ` ${quota}`,
            price: formatNumber(params.basePrice, pricePrecision),
          })}
        </Text>
      ) : (
        <>
          <OpenOrderPK buyNum={open.buyNum} sellNum={open.sellNum} />
          <OpenOrderTable data={open.items} info={symbolInfo} />
        </>
      )}
    </div>
  );
};
