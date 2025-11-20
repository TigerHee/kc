/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useLayoutEffect, createContext } from 'react';
import { useSelector, useDispatch } from 'dva';
import { _t, _tHTML } from 'Bot/utils/lang';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
import isEmpty from 'lodash/isEmpty';
import { div100 } from 'Bot/helper';
import { Divider, useSnackbar, Button } from '@kux/mui';
import ParamaterPage from 'Bot/Strategies/components/ParamaterPage';
import SideTextByDirection from 'FutureMartingale/components/SideTextByDirection';
import { Row } from 'FutureMartingale/Create/components/widgets';
import { ContextOfParamsPage } from 'FutureMartingale/Create/model';
import { processData, getBuyAfterFallLabel } from 'FutureMartingale/util';
import { updateBotParams } from 'FutureMartingale/services';
import { addMarginApiConfig } from 'FutureMartingale/config';
import FutureAddMargin from 'Bot/Strategies/components/FutureAddMargin';

export default ({ isActive, onClose, runningData, mode }) => {
  const { id, symbolCode, status, price } = runningData;
  const params = useSelector((state) => state.futuremartingale.runParams);
  const ParamaterLoading = useSelector((state) => state.futuremartingale.ParamaterLoading);
  const dispatch = useDispatch();
  const symbolInfo = useFutureSymbolInfo(symbolCode);
  const { base, quota, symbolNameText } = symbolInfo;
  const { message } = useSnackbar();
  const isStopped = status === 'STOPPED';
  const onFresh = useCallback(() => {
    dispatch({
      type: 'futuremartingale/getParameter',
      payload: {
        id,
      },
    });
  }, []);
  useLayoutEffect(() => {
    isActive && onFresh();
  }, [isActive]);

  const currentItem = {
    symbol: symbolCode,
    id,
    price,
    status,
    isStopped,
    ...params,
  };
  const ctxValue = {
    isStopped,
    mode: 'edit',
    symbolInfo,
    formData: processData(currentItem),
    setMergeState: (updateParams) => {
      // 将止损百分比转小数
      if (Number(updateParams.stopLossPercent) > 0) {
        updateParams.stopLossPercent = div100(updateParams.stopLossPercent);
      }
      updateBotParams({
        taskId: id,
        circularOpeningCondition: params.circularOpeningCondition,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        stopLossPercent: params.stopLossPercent,
        stopLossPrice: params.stopLossPrice,
        ...updateParams,
      }).then(() => {
        onFresh();
        message.success(_t('runningdetail'));
      });
    },
  };

  const addInvestRef = React.useRef();
  const onTriggerInvestment = React.useCallback(() => {
    if (status !== 'RUNNING') return;
    addInvestRef.current.toggle({ item: runningData, symbolInfo });
  }, []);

  if (isEmpty(params) || ParamaterLoading) return null;
  return (
    <ParamaterPage
      id={id}
      symbolNameText={symbolNameText}
      direction={params.direction}
      leverage={params.leverage}
    >
      <ContextOfParamsPage.Provider value={ctxValue}>
        <SideTextByDirection direction={params.direction} isBuy />
        <Row
          editRowProps={{ mt: 16 }}
          isParamsPage
          formKey="buyAfterFall"
          label={_t(getBuyAfterFallLabel(params.direction))}
          unit="%"
        />
        <Row isParamsPage formKey="buyTimes" label={_t('aJ1yfUGXxw4C81FDYBW8Mm')} />
        <Row
          isParamsPage
          formKey="buyMultiple"
          label={_t('9Soj8pxepbL1a8gov36Ykk')}
          hintKey="9Soj8pxepbL1a8gov36Ykk"
          unit="x"
          editRowProps={{ mb: 32 }}
        />

        <SideTextByDirection direction={params.direction} isSell />
        <Row
          editRowProps={{ mt: 16 }}
          isParamsPage
          formKey="stopProfitPercent"
          label={_t('c2mby2vVJSB48j4k73saca')}
          unit="%"
        />

        <Divider mt={32} mb={32} />

        <Row
          isParamsPage
          formKey="openUnitPrice"
          label={_t('p36PVMDHJnGYexgBmLgrvN')}
          hintKey="p36PVMDHJnGYexgBmLgrvN"
        />
        <Row
          isParamsPage
          formKey="circularOpeningCondition"
          label={_t('rTsH2BV1bbEsPXqZxwNscA')}
          hintSheet
          dropdown
        />
        <Row
          isParamsPage
          formKey="openPriceRange"
          label={_t('g7VQsQSvnwTQ19cKnCM1ip')}
          hintKey="g7VQsQSvnwTQ19cKnCM1ip"
          inputSheet
        />
        <Row isParamsPage formKey="stoploss" inputSheet label={_t('lossstop')} hintKey="lossstop" />
        {status === 'RUNNING' && (
          <>
            <Divider mt={32} mb={32} />
            <Button variant="outlined" fullWidth onClick={onTriggerInvestment}>
              {_t('smart.saddmargin')}
            </Button>
            <FutureAddMargin
              apiConfig={addMarginApiConfig}
              onFresh={onFresh}
              actionSheetRef={addInvestRef}
            />
          </>
        )}
      </ContextOfParamsPage.Provider>
    </ParamaterPage>
  );
};
