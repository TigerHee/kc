/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useLayoutEffect, createContext } from 'react';
import { useSelector, useDispatch } from 'dva';
import { _t, _tHTML } from 'Bot/utils/lang';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import isEmpty from 'lodash/isEmpty';
import { div100 } from 'Bot/helper';
import { Divider, useSnackbar } from '@kux/mui';
import ParamaterPage from 'Bot/Strategies/components/ParamaterPage';
import SideTextByDirection from 'FutureMartingale/components/SideTextByDirection';
import { Row } from 'Martingale/Create/components/widgets';
import { ContextOfParamsPage } from 'Martingale/Create/model';
import { processData } from 'FutureMartingale/util';
import { updateBotParams } from 'Martingale/services';

export default ({ isActive, onClose, runningData: { id, symbol, status, price }, mode }) => {
  const params = useSelector((state) => state.martingale.runParams);
  const ParamaterLoading = useSelector((state) => state.martingale.ParamaterLoading);
  const dispatch = useDispatch();
  const symbolInfo = useSpotSymbolInfo(symbol);
  const { base, quota, symbolCode, symbolNameText } = symbolInfo;
  const { message } = useSnackbar();
  const isStopped = status === 'STOPPED';
  const onFresh = useCallback(() => {
    dispatch({
      type: 'martingale/getParameter',
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
    direction: 'long', // 模拟合约马丁的字段
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
  if (isEmpty(params) || ParamaterLoading) return null;
  return (
    <ParamaterPage id={id} symbolNameText={symbolNameText}>
      <ContextOfParamsPage.Provider value={ctxValue}>
        <SideTextByDirection isBuy />
        <Row
          editRowProps={{ mt: 16 }}
          isParamsPage
          formKey="buyAfterFall"
          label={_t('rjtTsZTWM5bqh7Rzmbr4Gt')}
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

        <SideTextByDirection isSell />
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
      </ContextOfParamsPage.Provider>
    </ParamaterPage>
  );
};
