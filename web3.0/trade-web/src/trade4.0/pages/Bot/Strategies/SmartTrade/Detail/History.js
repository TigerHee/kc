/**
 * Owner: mike.hu@kupotech.com
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'dva';
import styled from '@emotion/styled';
import { times100, localDateTimeFormat } from 'Bot/helper';
import Switch from '@mui/Switch';
import Empty from '@mui/Empty';
import Row from 'Bot/components/Common/Row';
import Popover from 'Bot/components/Common/Popover';
import { Table, TableHD, TableBD } from 'SmartTrade/components/AdjustChange';
import HistoyrDetailRef from './HistoryDetail';
import TransferDetailRef from './TransferDetail';
import { MIcons, SvgIcon } from 'Bot/components/Common/Icon';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text, Flex } from 'Bot/components/Widgets';

const Box = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  margin-top: 16px;
  .flex1 {
    flex: 1;
  }
`;
const TableBDWithStyle = styled.div`
  background-color: ${({ theme }) => theme.colors.cover2};
  ${({ cursorPointer }) => {
    if (cursorPointer) {
      return {
        cursor: 'pointer',
      };
    }
  }}
  &:hover {
    background-color: ${({ cursorPointer, theme }) =>
      theme.colors[cursorPointer ? 'cover40' : 'cover4']};
  }
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 16px;
  transition: all 0.3s linear;
  .table-hd {
    border-bottom: 1px solid ${({ theme }) => theme.colors.divider8};
    padding-bottom: 8px;
    margin-bottom: 8px;
    span {
      color: ${({ theme }) => theme.colors.text40};
      font-size: 12px;
      line-height: 130%;
    }
  }
  .table-bd {
    margin-bottom: 12px;
  }
`;

const getAdjustStatusInfo = (status, message) => {
  let title = _t('smart.ajustnotsuccess'); // 调仓记录
  let msg = '';
  let code = 1; // 0 成功， 1失败，2不用调仓
  switch (status) {
    case 'SUCCESS':
      code = 0;
      title = _t('smart.ajustsuccess'); // 调仓成功
      msg = _t('smart.ajustsuccess'); // 调仓成功
      break;
    case 'NO_BALANCE':
      code = 1;
      // title = _t('smart.ajustnotsuccess') // 调仓成功
      msg = _t('smart.ajustfailnobalance'); // USDT余额小于最小下单金额
      break;
    case 'INSUFFICIENT_DEVIATION':
      code = 1;
      // title = _t('smart.noajust')// 未调仓
      msg = _t('smart.ajustnoneed'); // 最大偏离没到0.5%：仓位变动较小，此次无需调仓
      break;
    case 'PIN_DETECTED':
      msg = _t('smart.ajustfailbodong'); // 行情波动剧烈，调仓未完成，机器人将自动重试
      break;
    case 'OUT_OF_IOC':
      msg = _t('smart.ajustfaildepth', { symbol: message }); // {symbol}深度不足，调仓未完成，机器人将自动重试
      break;
    case 'TIMEOUT':
      msg = _t('smart.ajustfailtimeout'); // 调仓未完成，连接超时
      break;
    case 'SYMBOL_SUSPENDED':
      code = 1;
      // title = _t('smart.noajust')
      msg = _t('smart.ajustfailsymbolnotuse', { symbol: message }); // {symbol}交易对不可用
      break;
    case 'SYMBOL_NOT_SUPPORTED_IP':
      code = 1;
      msg = _t('smart.iplimit');
      break;
    case 'SYMBOL_NOT_AVAILABLE':
      code = 1;
      msg = _t('smart.symbolnotavail'); // 部分交易币种暂不支持交易，调仓未完成
      break;
    case 'SYMBOL_NOT_SUPPORTED_COUNTRY':
      code = 1;
      msg = _t('smart.symbolnotavailincountry'); // 当前国家{symbol}交易对不可用
      break;
    case 'ORDER_TIMEOUT':
      code = 1;
      // title = _t('smart.noajust')
      msg = _t('smart.ajustfailorderout', { symbol: message }); // {symbol}下单超时，稍后重试
      break;
    default:
      // 调仓未完成，机器人将自动重试。原因：未知
      msg = _t('smart.ajustfailunkown');
      break;
  }
  return {
    title,
    msg,
    code,
  };
};
const TableType = 'typeOfOrderList';

const CardBD = ({ list, onDetail }) => {
  const showDetail = () => {
    if (!list.isChanged) return;
    onDetail({ list });
  };
  const status = getAdjustStatusInfo(list.result, list.message);
  const StatusColumn = (
    <Flex vc sb mb={12}>
      <Flex vc fs={14} color="text">
        {list.isManual && (
          <Popover placement="top" title={_t('smart.handadjust')}>
            <SvgIcon type="touch" fileName="botsvg" size={16} color="icon" />
          </Popover>
        )}

        {status.title}

        {status.code === 1 && (
          <Popover placement="top" title={status.msg}>
            <MIcons.Question size={16} color="icon60" />
          </Popover>
        )}
      </Flex>
      <Flex vc>
        <Text fs={12} color="text60">
          {localDateTimeFormat(list.completeTime)}
        </Text>

        {list.isChanged && <MIcons.ArrowRight size={16} color="icon" />}
      </Flex>
    </Flex>
  );
  return (
    <TableBDWithStyle cursorPointer={list.isChanged} onClick={showDetail}>
      {StatusColumn}
      <TableHD type={TableType} hasEntryPrice={false} />
      <TableBD type={TableType} change={list.change} hasEntryPrice={false} />
    </TableBDWithStyle>
  );
};

const formatChange = (stop) => {
  return stop.map((el) => {
    el = { ...el };
    const afterMap = {};
    el.change = [];
    if (el.afterPosition) {
      el.afterPosition.forEach((pre) => {
        afterMap[pre.currency] = pre;
      });
    }
    if (el.prePosition) {
      el.prePosition.forEach((pre) => {
        const before = times100(pre.percent);
        const after = times100(afterMap[pre.currency]?.percent ?? 0);
        el.change.push({
          base: pre.currency,
          before,
          after,
          changer: after - before,
        });
      });
    }
    return el;
  });
};

export default ({ isActive, runningData: { id } }) => {
  const [onlyShowChanged, setOnlyShowChanged] = useState(true);
  let stopRaw = useSelector((state) => state.smarttrade.stop.items || []);
  const dispatch = useDispatch();
  // 组装change数据
  stopRaw = formatChange(stopRaw);

  const stop = onlyShowChanged ? stopRaw.filter((el) => el.result === 'SUCCESS') : stopRaw;

  useEffect(() => {
    dispatch({
      type: 'smarttrade/getStopOrders',
      payload: {
        taskId: id,
      },
    });
  }, []);

  const transferRef = useRef();
  const goToTransfers = useCallback(() => {
    transferRef.current.toggle({ botTaskId: id });
  }, []);

  const detailRef = useRef();
  const onDetail = useCallback((childProps) => {
    detailRef.current.toggle({ ...childProps, botTaskId: id });
  }, []);
  return (
    <Box>
      <Row
        cursor
        classRowName="fs-16 cursor-pointer mb-12"
        label={_t('smart.transfersrecord')}
        value={<MIcons.ArrowRight size={16} color="icon" />}
        onClick={goToTransfers}
      />
      <Row
        classRowName="fs-16 mb-18"
        label={_t('smart.filterunadjust')}
        value={<Switch onChange={setOnlyShowChanged} checked={onlyShowChanged} />}
      />

      <Table type={TableType} hasEntryPrice={false}>
        {stop.map((list) => (
          <CardBD list={list} key={list.id} onDetail={onDetail} />
        ))}
      </Table>

      {stop.length > 0 && (
        <Text color="text40" className="fs-12 pt-6">
          {_t('stoporders8')}
        </Text>
      )}
      {stop.length === 0 && <Empty className="flex1" />}

      <HistoyrDetailRef dialogRef={detailRef} />
      <TransferDetailRef dialogRef={transferRef} />
    </Box>
  );
};
