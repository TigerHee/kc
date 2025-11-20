/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useRef, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { ParamRow } from 'Bot/components/Common/Row';
import { _t, _tHTML } from 'Bot/utils/lang';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import useStateRef from '@/hooks/common/useStateRef';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import { formatNumber, floatToPercent, convertBool } from 'Bot/helper';
import { Button, Divider, styled, Switch } from '@kux/mui';
import { useSnackbar } from '@kux/mui/hooks';
import { setCanReInvestment, setNoticeOutbound } from 'Bot/services/running';
import EntryPrice from 'ClassicGrid/components/EntryPrice';
import ParamaterPage from 'Bot/Strategies/components/ParamaterPage';
import UpdatePriceRangeActionSheet from 'ClassicGrid/components/UpdatePriceRangeActionSheet';
import AddMoneyActionSheet from 'ClassicGrid/components/AddMoneyActionSheet';
import StopLoss from 'Bot/Strategies/components/StopLoss';
import StopProfit from 'Bot/Strategies/components/StopProfit';
import PauseAndRestart from 'ClassicGrid/components/PauseAndRestart';

const MParamRow = styled(ParamRow)`
  .row-label span {
    color: ${({ theme }) => theme.colors.text60};
  }
`;
const MEntryPrice = styled(EntryPrice)`
  display: inline-flex;
`;
const getGridProfit = (params) => {
  let gridProfit = null;
  if (!isEmpty(params)) {
    gridProfit = `${floatToPercent(params.gridProfitLowerRatio, 2)}～${floatToPercent(
      params.gridProfitUpperRatio,
      2,
    )}`;
  }
  return gridProfit;
};

export default ({ isActive, onClose, runningData: { id, symbol, status, price }, mode }) => {
  const params = useSelector((state) => state.classicgrid.runParams);
  const ParamaterLoading = useSelector((state) => state.classicgrid.ParamaterLoading);
  const { message } = useSnackbar();
  const showToast = () => {
    message.info(_t('hassetentryprice'));
  };
  const showPauseToast = () => {
    message.info(_t('rjbxNmaPGvFoKHMQEwtdTw'));
  };
  // 现货网格暂停中 不能修改
  const isPaused = params.status === 'PAUSED';
  const dispatch = useDispatch();
  const symbolInfo = useSpotSymbolInfo(symbol);
  const { base, quota, pricePrecision, basePrecision, symbolNameText, symbolCode } = symbolInfo;
  const useDataRef = useStateRef({
    symbolInfo,
    item: {
      symbol: symbolCode,
      id,
      price,
      ...params,
    },
  });
  const stopped = mode === 'history';
  const onFresh = useCallback(() => {
    dispatch({
      type: 'classicgrid/getParameter',
      payload: {
        id,
      },
    });
  }, []);
  useLayoutEffect(() => {
    isActive && onFresh();
  }, [isActive]);

  const gridProfit = getGridProfit(params);

  const stopProfitPriceRef = useRef();
  const stopLossPriceRef = useRef();
  const addInvestmentRef = useRef();
  const updatePriceRangeRef = useRef();
  const pauseRestartActionSheetRef = useRef();

  // 重启需要的字段
  const restartItem = {
    taskId: id,
    basePrice: params.basePrice,
    status: params.status, // 暂停时的价格
    symbolPrice: price,
    stopLossPrice: params.stopLossPrice,
    stopProfitPrice: params.stopProfitPrice,
    symbolCode: symbol,
  };
  // 暂停/重启函数
  const pauseRestartJack = useCallback((e) => {
    pauseRestartActionSheetRef.current.toggle();
  }, []);

  const addInvestmentHandler = useCallback(() => {
    if (isPaused) {
      return showPauseToast();
    }
    addInvestmentRef.current.toggle(useDataRef.current);
  }, [isPaused]);

  const onStopProfit = useCallback(
    debounce(() => {
      if (stopped) return;
      if (isPaused) {
        return showPauseToast();
      }
      stopProfitPriceRef.current.toggle(useDataRef.current);
    }, 600),
    [stopped, isPaused],
  );

  const onStopLoss = useCallback(
    debounce(() => {
      if (isPaused) {
        return showPauseToast();
      }
      if (!stopped) {
        stopLossPriceRef.current.toggle(useDataRef.current);
      }
    }, 600),
    [stopped, isPaused],
  );

  const showUpdatePriceRangeHandler = useCallback(() => {
    if (isPaused) {
      return showPauseToast();
    }
    if (!stopped) {
      const { item } = useDataRef.current;
      updatePriceRangeRef.current.toggle({
        taskId: item.id,
        down: item.down,
        up: item.up,
        symbol: item.symbol,
        price: item.price,
      });
    }
  }, [stopped, isPaused]);
  const notEdit = stopped || isPaused;

  // 网格利润复投
  const onCanReInvestmentChange = useCallback(
    (e) => {
      setCanReInvestment({
        taskId: id,
        canReInvestment: e,
      }).then(onFresh);
    },
    [id],
  );
  // 出区间自动提醒
  const submitNoticeOutbound = useCallback(
    (e) => {
      setNoticeOutbound({
        taskId: id,
        isNoticeOutbound: e,
        stopLossPrice: params.stopLossPrice,
      }).then(onFresh);
    },
    [id, params],
  );
  if (isEmpty(params) || ParamaterLoading) return null;
  return (
    <ParamaterPage id={id} symbolNameText={symbolNameText}>
      <ParamRow
        hasArrow={!notEdit}
        onClick={showUpdatePriceRangeHandler}
        label={_t('card13')}
        value={`${formatNumber(params.down, pricePrecision)}～${formatNumber(
          params.up,
          pricePrecision,
        )}`}
        unit={quota}
      />
      <ParamRow
        hover={!notEdit}
        label={_t('card14')}
        value={
          <MEntryPrice
            value={params.entryPrice}
            pricePrecision={pricePrecision}
            isUpdate={params.hasEntryPriceHis}
            taskId={id}
            noMargin
          />
        }
        unit={quota}
      />
      <ParamRow label={_t('robotparams10')} value={`${+params.depth - 1}`} unit={_t('unit')} />

      <ParamRow
        label={_t('robotparams3')}
        value={`${formatNumber(params.size, basePrecision)}`}
        unit={base}
      />

      <ParamRow label={_t('robotparams6')} value={gridProfit || '--'} />

      <Divider mt={32} mb={32} />

      <ParamRow
        checkUnSet
        hasArrow={!notEdit}
        label={_t('gridform21')}
        rawValue={params.stopLossPrice}
        value={formatNumber(params.stopLossPrice, pricePrecision)}
        unit={quota}
        onClick={onStopLoss}
      />
      <ParamRow
        checkUnSet
        rawValue={params.stopProfitPrice}
        hasArrow={!notEdit}
        label={_t('stopprofit')}
        value={formatNumber(params.stopProfitPrice, pricePrecision)}
        unit={quota}
        onClick={onStopProfit}
      />
      <ParamRow
        checkUnSet
        hasArrow={false}
        label={_t('openprice')}
        rawValue={params.openUnitPrice}
        value={formatNumber(params.openUnitPrice, pricePrecision)}
        unit={quota}
        onClick={showToast}
      />
      <MParamRow
        tipKey="noticeOutbound"
        straName="GRID"
        label={_t('outrangehint')}
        value={
          <Switch
            onChange={submitNoticeOutbound}
            checked={convertBool(params.isNoticeOutbound)}
            disabled={stopped}
          />
        }
      />
      <ParamRow
        label={_t('dfqroD85wBpSDoP7ZnrbC1')}
        valueSlot={
          <Switch
            onChange={pauseRestartJack}
            checked={params.status === 'PAUSED'}
            disabled={stopped}
          />
        }
      />
      <ParamRow
        labelPopoverContent={_t('tRHTdEV2BBBhCfe78okJp4')}
        label={_t('8wXevk7txKQcBRBAR16bwn')}
        valueSlot={
          <Switch
            onChange={onCanReInvestmentChange}
            checked={params.canReInvestment === 'true'}
            disabled={stopped}
          />
        }
      />

      {status === 'RUNNING' && (
        <>
          <Divider mt={32} mb={32} />
          <Button variant="outlined" fullWidth onClick={addInvestmentHandler}>
            {_t('smart.saddmargin')}
          </Button>
        </>
      )}

      <AddMoneyActionSheet onFresh={onFresh} actionSheetRef={addInvestmentRef} />
      <UpdatePriceRangeActionSheet onFresh={onFresh} actionSheetRef={updatePriceRangeRef} />
      <StopProfit onFresh={onFresh} actionSheetRef={stopProfitPriceRef} type="classicgrid" />
      <StopLoss onFresh={onFresh} actionSheetRef={stopLossPriceRef} type="classicgrid" />
      <PauseAndRestart
        actionSheerRef={pauseRestartActionSheetRef}
        item={restartItem}
        onFresh={onFresh}
      />
    </ParamaterPage>
  );
};
