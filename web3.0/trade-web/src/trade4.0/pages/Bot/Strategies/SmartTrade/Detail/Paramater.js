/**
 * Owner: mike.hu@kupotech.com
 */
import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'dva';
import { Button, Divider, styled } from '@kux/mui';
import _ from 'lodash';
import { UpdateMethodInParameterPage } from 'SmartTrade/components/AjustWay';
import StopLossProfitSetting from 'SmartTrade/components/StopLossProfitSetting';
import LayoutPie from './LayoutPie';
import { EntryPriceRowWhenCreate } from 'SmartTrade/components/EntryPrice';
import AddInvest from 'SmartTrade/components/AddInvest';
import ParamaterPage from 'Bot/Strategies/components/ParamaterPage';
import { _t, _tHTML } from 'Bot/utils/lang';

const Setting = styled.div`
  .lossprofit-setting,
  .update-entry-price {
    font-size: 16px;
    margin-bottom: 12px;
    font-weight: 400;
    .editRow-label {
      color: ${({ theme }) => theme.colors.text};
    }
  }
`;
export default ({ isActive, onClose, runningData: { id, symbol, status, price }, mode }) => {
  const params = useSelector((state) => state.smarttrade.runParams);
  const open = useSelector((state) => state.smarttrade.open.items);
  const ParamaterLoading = useSelector((state) => state.smarttrade.ParamaterLoading);
  const dispatch = useDispatch();
  const isStoped = status === 'STOPPED';
  const onFresh = useCallback(() => {
    dispatch({
      type: 'smarttrade/getParameter',
      payload: {
        id,
      },
    });
  }, []);
  useEffect(() => {
    isActive && onFresh();
  }, [isActive]);
  // 没有触发的
  const notTriggerPriceLists =
    params?.targets?.filter((current) => current.isTriggered === false) ?? [];

  const addInvestRef = useRef();
  const onTriggerAddInvest = () => {
    const item = {
      id,
      totalCost: params.totalInvestmentUsdt,
      stopLoss: params.stopLoss,
      isSellOnStopLoss: params.isSellOnStopLoss,
      stopProfit: params.stopProfit,
      isSellOnStopProfit: params.isSellOnStopProfit,
      targets: params.targets,
      snapshots: params.beforeOverview?.snapshots ?? [],
    };
    addInvestRef.current.toggle({ item });
  };
  if (_.isEmpty(params) || ParamaterLoading) return null;
  return (
    <ParamaterPage hidden={!isActive} id={id}>
      <LayoutPie params={params} taskId={id} stopped={isStoped} onFresh={onFresh} />

      <Divider mt={32} mb={32} />

      <Setting className="lists">
        {/* 自动调仓设置 */}
        <UpdateMethodInParameterPage
          stopped={isStoped}
          params={params}
          onFresh={onFresh}
          taskId={id}
        />
        {/* 止损设置 */}
        <StopLossProfitSetting
          mode="update"
          scene="loss"
          params={params}
          open={open}
          onFresh={onFresh}
          taskId={id}
          stopped={isStoped}
        />
        {/* 止盈设置 */}
        <StopLossProfitSetting
          mode="update"
          scene="profit"
          params={params}
          open={open}
          onFresh={onFresh}
          taskId={id}
          stopped={isStoped}
        />
        <EntryPriceRowWhenCreate
          stopped={isStoped}
          coins={notTriggerPriceLists}
          updateParams={{
            id,
            targets: params?.targets,
            onFresh,
          }}
          mode="params-setting"
          className="update-entry-price"
        />
      </Setting>

      {status === 'RUNNING' && (
        <>
          <Divider mt={32} mb={32} />
          <Button variant="outlined" fullWidth onClick={onTriggerAddInvest}>
            {_t('smart.saddmargin')}
          </Button>
          <AddInvest actionSheetRef={addInvestRef} onFresh={onFresh} />
        </>
      )}
    </ParamaterPage>
  );
};
