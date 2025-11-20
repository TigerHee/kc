/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import StopOrder from 'Bot/components/Common/history';
import { _t, _tHTML } from 'Bot/utils/lang';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import HistoryPage from 'Bot/Strategies/components/HistoryPage';
import { formatEffectiveDecimal, localDateTimeFormat, formatNumber } from 'Bot/helper';
import { getDealAvg } from 'Bot/utils/util';
import { Tabs } from '@mui/Tabs';
import styled from '@emotion/styled';
import { Text, Flex } from 'Bot/components/Widgets';
import { Profit } from 'Bot/components/ColorText';
import Empty from '@mui/Empty';
import isEmpty from 'lodash/isEmpty';

const FirstBuy = styled.div`
  display: flex;
  justify-content: space-between;
  height: 67px;
  margin: 10px 0;
  background: ${({ theme }) => theme.colors.cover2};
  border-radius: 4px;
  padding: 14px;
  font-size: 12px;
  line-height: 20px;
  align-items: center;
`;
const OutIn = styled.div`
  display: flex;
  height: 60px;
  line-height: 20px;
  padding: 12px 16px;
  font-size: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;
const TRANSFERTYPE = {
  CREATE_IN: 'CREATE_IN', // 创建时 初始转入
  ADD_IN: 'ADD_IN', // 加仓时，转入
  REDUCE_OUT: 'REDUCE_OUT', // 减仓时，转出
  CLOSE_OUT: 'CLOSE_OUT', // 关闭时，转出
  IN: 'IN', // 兼容历史数据， 为IN时，表示关闭时转出
};

const getTransferType = (type) => {
  if (type === TRANSFERTYPE.ADD_IN) {
    return {
      type: 'plus',
      lang: _t('transferinmoney'),
    };
  } else if (
    type === TRANSFERTYPE.REDUCE_OUT ||
    type === TRANSFERTYPE.CLOSE_OUT ||
    type === TRANSFERTYPE.IN
  ) {
    return {
      type: 'reduce',
      lang: _t('transferoutmoney'),
    };
  }
};
const TransferRecord = ({ stop, symbolInfo, ...rest }) => {
  if (isEmpty(stop?.transferDetails)) {
    return <Empty />;
  }
  return (
    <div {...rest}>
      {stop?.transferDetails[0]?.type === TRANSFERTYPE.CREATE_IN && (
        <FirstBuy className="firstBuy">
          <div>
            <Text as="div" color="text40">
              {_t('7qZRaEH5Aa61xzecuLf81B')}
            </Text>
            <Text as="div" color="text">
              {formatNumber(stop?.transferDetails[0].size, symbolInfo.quotaPrecision)}
              <Text color="text40">{` ${stop?.transferDetails[0].currency}`}</Text>
            </Text>
          </div>
          <Text color="text60">{localDateTimeFormat(stop?.transferDetails[0].createdAt)}</Text>
        </FirstBuy>
      )}
      {stop?.transferDetails.map((item, index) => {
        if (item.type === TRANSFERTYPE.CREATE_IN) {
          return null;
        }
        const currentItem = getTransferType(item.type);
        return (
          <OutIn className="outIn" key={index}>
            <div>
              <Text color="text40">{currentItem?.lang || ''}</Text>
              <Text as="div" color="text40">
                {localDateTimeFormat(item.createdAt)}
              </Text>
            </div>
            <Profit
              precision={symbolInfo.quotaPrecision}
              value={currentItem?.type === 'reduce' ? `-${item.size}` : item.size}
              unit={item.currency}
            />
          </OutIn>
        );
      })}
    </div>
  );
};
/**
 * @description: 现货网格/无限网格/杠杆网格
 * @param {*} items
 * @param {*} symbolInfo
 * @param {*} onClick
 * @return {*}
 */
const formatField = ({ items, symbolInfo }) => {
  const { base, quota, symbolNameText, pricePrecision, basePrecision, quotaPrecision } = symbolInfo;
  return items.map((item) => {
    const avgPrice = getDealAvg(item, pricePrecision);
    return {
      id: item.id,
      symbolNameText,
      side: item.side,
      type: item.type, // 订单类型
      time: localDateTimeFormat(item.completionAt),
_item: item,
_symbolInfo: symbolInfo,
      hasArrow: false,
      onClick: () => {},
      lists: [
        {
          label: _t('stoporders6'),
          value: avgPrice,
          unit: quota,
        },
        {
          label: _t('clsgrid.dealednum'),
          value: formatNumber(item.dealSize, basePrecision),
          unit: base,
          inSameColumn: 1,
        },
        {
          label: _t('clsgrid.dealede'),
          value: formatNumber(item.dealFunds, quotaPrecision),
          unit: quota,
          inSameColumn: 1,
        },
        {
          label: _t('soJMwxHAKzNREmaAgBB4Ki'),
          value:
            Number(item.profit) > 0 && item.side !== 'buy'
              ? formatEffectiveDecimal(item.profit, quotaPrecision)
              : null,
          unit: quota,
          rawValue: item.profit,
          isProfitField: true,
        },
      ],
    };
  });
};
const modelName = 'martingale';
/**
 * @description: 现货/无限/超级网格基本通用
 * @return {*}
 */
export default ({
  isActive,
  onClose,
  runningData, // 运行中的数据
  mode,
  formatFieldFunc = formatField, // 数据格式化函数
}) => {
  const { id, symbolCode, symbol, status } = runningData;
  const code = symbolCode || symbol;
  // 内含hook判断
  // NOTICE
  const symbolInfo = useSpotSymbolInfo(code);
  const dispatch = useDispatch();
  const stop = useSelector((state) => state[modelName].stop);
  const HistoryLoading = useSelector((state) => state[modelName].HistoryLoading);
  const [activeTab, setTab] = useState(0);
  useLayoutEffect(() => {
    isActive &&
      dispatch({
        type: `${modelName}/getStopOrders`,
        payload: {
          taskId: id,
          symbolCode: code,
        },
      });
  }, [isActive]);

  if (HistoryLoading) return null;
  const items = formatFieldFunc({ items: stop.items, symbolInfo });
  return (
    <div>
      <Tabs value={activeTab} onChange={(e, val) => setTab(val)} size="xsmall" indicator={false}>
        <Tabs.Tab
          label={`${_t('stopOrders')}(${+stop.totalNum >= 100 ? '99+' : +stop.totalNum})`}
          value={0}
        />
        <Tabs.Tab label={_t('smart.transfersrecord')} value={1} />
      </Tabs>
      <HistoryPage isEmpty={isEmpty(items)} hidden={activeTab === 1}>
        <StopOrder items={items} />
      </HistoryPage>
      <TransferRecord hidden={activeTab === 0} stop={stop} symbolInfo={symbolInfo} />
    </div>
  );
};
