/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'dva';
import { ParamRow } from 'Bot/components/Common/Row';
import { _t, _tHTML } from 'Bot/utils/lang';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import isEmpty from 'lodash/isEmpty';
import { formatNumber, localDateTimeFormat, floatToPercent, times100, div100 } from 'Bot/helper';
import ParamaterPage from 'Bot/Strategies/components/ParamaterPage';
import ProfitTargetDialog from 'AutomaticInverst/components/ProfitTargetDialog';
import useStateRef from '@/hooks/common/useStateRef';
import { postAndFresh } from '../components/Base';
import InvestEvery from '../components/InvestEvery';
import InvestFrequency from '../components/InvestFrequency';
import DayOfWeek from '../components/DayOfWeek';
import InvestUpLimit from '../components/InvestUpLimit';
import useBalance from 'Bot/hooks/useBalance';
import { useSnackbar } from '@kux/mui';

const ProfitTargetRow = ({ params, stopped, onConfirmRef, symbolInfo }) => {
  const open = useSelector((state) => state.automaticinverst.open);
  const isTargetSellBase = params?.isTargetSellBase === 'true' ? 1 : 0;
  // 修改盈利目标ref
  const profitTargetRef = useRef();
  const updateProfitTarget = () => {
    if (stopped) return;
    profitTargetRef.current.toggle();
  };
  const oldProfitTarget = {
    isTargetSellBase,
    profitTarget: times100(params.profitTarget),
  };
  // 提交盈利目标修改
  const onProfitTargetSubmit = (data) => {
    onConfirmRef
      .current({
        isTargetSellBase: data.isTargetSellBase,
        profitTarget: div100(data.profitTarget),
      })
      .then(profitTargetRef.current.close);
  };
  return (
    <>
      <ParamRow
        onClick={updateProfitTarget}
        hasArrow={!stopped}
        labelPopoverContent={_t(`auto.profithint${isTargetSellBase}`, {
          x: floatToPercent(params.profitTarget),
        })}
        label={_t('auto.profittarget')}
        value={`${floatToPercent(params.profitTarget)}(
    ${isTargetSellBase ? _t('auto.hintandsell') : _t('auto.onlyhint')})`}
      />
      <ProfitTargetDialog
        dialogRef={profitTargetRef}
        onChange={onProfitTargetSubmit}
        value={oldProfitTarget}
        symbolInfo={symbolInfo}
        showDescription
        open={open}
      />
    </>
  );
};

const InvestRow = ({ params, quota, stopped, onConfirmRef, dataRef }) => {
  // 修改每次投资额度ref
  const investEveryRef = useRef();
  const updateInvestEvery = () => {
    if (stopped) return;
    investEveryRef.current.toggle();
  };
  return (
    <>
      <ParamRow
        label={_t('auto.perinvertmuch')}
        value={formatNumber(params.amount)}
        unit={quota}
        hasArrow={!stopped}
        onClick={updateInvestEvery}
      />
      <InvestEvery dialogRef={investEveryRef} onConfirmRef={onConfirmRef} dataRef={dataRef} />
    </>
  );
};

const InvestUpLimitRow = ({ stopped, params, quotaPrecision, quota, dataRef, onConfirmRef }) => {
  // 修改定投上限ref
  const investUpLimit = useRef();
  const updateInvestUpLimit = () => {
    if (stopped) return;
    investUpLimit.current.toggle();
  };
  return (
    <>
      {/* 定投上限 */}
      <ParamRow
        checkUnSet
        label={_t('auto.upistlmtamout')}
        onClick={updateInvestUpLimit}
        rawValue={params.maxTotalCost}
        value={formatNumber(params.maxTotalCost, quotaPrecision)}
        unit={quota}
        hasArrow={!stopped}
      />
      <InvestUpLimit dialogRef={investUpLimit} dataRef={dataRef} onConfirmRef={onConfirmRef} />
    </>
  );
};
export default ({ isActive, onClose, runningData: { id, symbol, status }, mode }) => {
  const open = useSelector((state) => state.automaticinverst.open);
  const params = useSelector((state) => state.automaticinverst.runParams);
  const ParamaterLoading = useSelector((state) => state.automaticinverst.ParamaterLoading);
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const symbolInfo = useSpotSymbolInfo(symbol);
  const { quota, pricePrecision, symbolNameText, quotaPrecision } = symbolInfo;
  const balance = useBalance(symbolInfo);
  const [disableUpdateInvestEvery, setDisableUpdateInvestEvery] = useState(false);
  const onFresh = useCallback(() => {
    dispatch({
      type: 'automaticinverst/getParameter',
      payload: {
        id,
      },
    });
  }, []);
  useLayoutEffect(() => {
    isActive && onFresh();
  }, [isActive]);
  const stopped = status === 'STOPPED';
  // 提交修改ref
  const onConfirmRef = useStateRef(postAndFresh({ dispatch, id, onFresh, message }));

  // 组合数据方便之后使用
  const dataRef = useStateRef({
    id,
    onFresh, // 刷新函数
    symbolInfo, // 精度信息
    params, // 策略参数
    balance, // 当前账户余额
    open, // 当前委托数据
    stopped,
    setDisableUpdateInvestEvery,
    disableUpdateInvestEvery, // 是否能修改每次投资额度
  });
  const onDayOfWeekChange = useCallback(({ dayOfWeek }) => {
    onConfirmRef.current({ dayOfWeek: dayOfWeek[0] });
  }, []);
  if (isEmpty(params) || ParamaterLoading) return null;
  return (
    <ParamaterPage id={id} symbolNameText={symbolNameText}>
      {/* 盈利目标 */}
      <ProfitTargetRow
        params={params}
        stopped={stopped}
        onConfirmRef={onConfirmRef}
        symbolInfo={symbolInfo}
      />
      {/* 每次投资额 */}
      <InvestRow
        params={params}
        quota={quota}
        stopped={stopped}
        onConfirmRef={onConfirmRef}
        dataRef={dataRef}
      />
      {/* 多久投一次 */}
      <ParamRow
        label={_t('auto.whentoinverst')}
        classValueName="capitalize"
        value={<InvestFrequency onConfirmRef={onConfirmRef} dataRef={dataRef} />}
        hasArrow={!stopped}
      />

      {/* 定投日 */}
      <DayOfWeek type="params" value={params} onChange={onDayOfWeekChange} hasArrow={!stopped} />

      {/* 定投上限 */}
      <InvestUpLimitRow
        quotaPrecision={quotaPrecision}
        params={params}
        quota={quota}
        stopped={stopped}
        onConfirmRef={onConfirmRef}
        dataRef={dataRef}
      />
      {!stopped && (
        <ParamRow
          label={_t('nextdcatime')}
          classValueName="capitalize"
          value={localDateTimeFormat(Number(params.nextTime), {
            second: undefined,
            hourCycle: 'h23',
          })}
        />
      )}
    </ParamaterPage>
  );
};
