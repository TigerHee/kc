/**
 * Owner: mike.hu@kupotech.com
 */
import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'dva';
import useTicker from 'Bot/hooks/useTicker';
import useStateRef from '@/hooks/common/useStateRef';
import { getCurrencyName } from 'Bot/hooks/useSpotSymbolInfo';
import styled from '@emotion/styled';
import { SymbolPriceShow, SymbolPriceSubscribe } from 'Bot/components/Common/SymbolPrice';
import { Profit, ChangeRate } from 'Bot/components/ColorText';
import { Text, Flex } from 'Bot/components/Widgets';
import { handleSortPercent } from 'SmartTrade/util';
import { getProfitCurve } from 'SmartTrade/services';
import { floatText, formatNumber } from 'Bot/helper';
import _ from 'lodash';
import LineChart from 'SmartTrade/components/Charts/LineChart';
import { Tabs } from '@mui/Tabs';
import { useIsRTL } from '@/hooks/common/useLang';
import { DetailHoldTemp } from 'Bot/components/Common/DetailHold';
import Decimal from 'decimal.js';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Divider } from '@kux/mui';

const MTabs = styled(Tabs)`
  .KuxTab-TabItem {
    padding: 4px 10px;
    margin-left: 4px;
  }
  .KuxTab-selected {
    background: ${({ theme }) => theme.colors.text};
    color: ${({ theme }) => theme.colors.textEmphasis};
    border-radius: 80px;
    &:hover {
      color: ${({ theme }) => theme.colors.textEmphasis};
    }
  }
`;
const Hold = ({ open }) => {
  const { investmentValue = 0, totalValue = 0 } = open;
  const columns = [
    {
      label: _t('smart.inverstassets'),
      value: `${formatNumber(investmentValue)} USDT`,
    },
    {
      label: _t('smart.currentassets'),
      value: `${formatNumber(totalValue)} USDT`,
    },
  ];
  return <DetailHoldTemp columns={columns} />;
};

const TabItems = [
  {
    value: 'DAILY',
    label: 'smart.daily',
  },
  {
    value: 'WEEKLY',
    label: 'smart.weekly',
  },
  {
    value: 'MONTHLY',
    label: 'smart.monthly',
  },
];
const Box = styled.div`
  background-color: ${(props) => props.theme.colors.cover2};
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 32px;
  margin-top: 16px;
`;
const Profits = ({ taskId, open }) => {
  const [value, setValue] = useState('DAILY');
  const [firstLoading, setFirstLoading] = useState({
    DAILY: true,
    WEEKLY: true,
    MONTHLY: true,
  });
  const [profit, setProfit] = useState({
    DAILY: {
      recentProfitRates: [],
      btcProfitRates: [],
      all: [],
    },
    WEEKLY: {},
    MONTHLY: {},
  });
  const currentCurve = profit[value]?.recentProfitRates ?? [];
  const useDataRef = useStateRef({
    profit,
    currentCurve,
  });
  useEffect(() => {
    // eslint-disable-next-line no-shadow
    const { currentCurve } = useDataRef.current;
    if (!_.isEmpty(currentCurve)) return undefined;

    getProfitCurve({ taskId, interval: value })
      .then(({ data }) => {
        // 先按照时间从小到大排序
        data.btcProfitRates = _.isEmpty(data.btcProfitRates) ? [] : data.btcProfitRates;
        data.recentProfitRates = _.isEmpty(data.recentProfitRates) ? [] : data.recentProfitRates;
        data.recentProfitRates.sort((a, b) => a.statistics_time - b.statistics_time);
        data.recentProfitRates.forEach((el) => {
          el.day = el.statisticsTime;
          el.profitRate = +el.profitRate;
          el.profit = Number(Decimal(el.profit).toFixed(3, Decimal.ROUND_DOWN));
          el.type = _t('myprofit');
        });

        // eslint-disable-next-line no-unused-expressions
        data.btcProfitRates?.sort((a, b) => a.statisticsTime - b.statisticsTime);
        // eslint-disable-next-line no-unused-expressions
        data.btcProfitRates?.forEach((el) => {
          el.day = el.statisticsTime;
          el.profitRate = +el.profitRate;
          el.type = _t('moupr', { code: 'BTC' });
        });

        setProfit((e) => ({
          ...e,
          [value]: {
            ...data,
            all: data.recentProfitRates.concat(data.btcProfitRates),
          },
        }));
      })
      .finally(() => {
        setFirstLoading((e) => ({ ...e, [value]: false }));
      });
  }, [taskId, value]);
  const { investmentValue } = open;
  let add = 0;
  if (currentCurve.length >= 2) {
    add = currentCurve[currentCurve.length - 1].profit - currentCurve[0].profit;
  } else {
    add = currentCurve[0]?.profit ?? 0;
  }

  const addRatio = Decimal(add).div(investmentValue).toFixed(3, Decimal.ROUND_DOWN);

  return (
    <Box>
      <MTabs value={value} onChange={(e, val) => setValue(val)} size="xsmall" indicator={false}>
        {TabItems.map((item) => {
          return <Tabs.Tab label={_t(item.label)} value={item.value} key={item.value} />;
        })}
      </MTabs>
      <div className="tab-body mt-12">
        <Flex vc fw={500}>
          <Text fs={12} color="text40" fw={500}>
            {_t('tabpage3')}
          </Text>
          <div
            className="ml-6"
            hidden={profit.DAILY.recentProfitRates.length <= 1 || (add === 0 && +addRatio === 0)}
          >
            <Profit className="fs-16" value={add} empty="--" precision={3} />
            &nbsp; &nbsp;
            <ChangeRate className="fs-12" value={addRatio} empty="--" />
          </div>
        </Flex>
      </div>

      <div className="profit-canvas" style={{ height: 300 }}>
        <LineChart
          data={profit[value].all}
          loading={firstLoading[value]}
          noData={!firstLoading[value] && !profit[value].all.length}
        />
      </div>
    </Box>
  );
};
const Grid = styled(Text)`
  display: grid;
  grid-template-columns: 33.3% 33.3% 33.3%;
  grid-row-gap: 12px;
`;
/**
 * @description: 展示当前仓位
 * @param {Array} snapshots
 * @return {*}
 */
const AssetSnapshots = ({ snapshots }) => {
  snapshots = handleSortPercent(snapshots);
  const symbolCodes = snapshots
    .filter((el) => el.currency !== 'USDT')
    .map((el) => `${el.currency}-USDT`);
  return (
    <div>
      <Text className="capitalize" fs={16} color="text" fw={700} as="div" mb={12}>
        {_t('smart.realholdlayout')}
      </Text>
      <Grid fs={12} color="text40" fw={500} lh="130%">
        <span>
          {_t('smart.coin')}/{_t('card12')}
        </span>
        <span className="right">{_t('openorder2')}</span>
        <span className="right">{_t('smart.zhanbi')}</span>
      </Grid>
      <Divider mt={12} mb={12} />
      <Grid fs={14} color="text">
        <SymbolPriceSubscribe symbolCodes={symbolCodes} />
        {snapshots.map((coin) => (
          <React.Fragment key={coin.currency}>
            <span>
              <div>{getCurrencyName(coin.currency)}</div>
              <SymbolPriceShow
                lastTradedPrice={coin.price}
                symbolCode={`${coin.currency}-USDT`}
              />
            </span>
            <span className="right ">{formatNumber(coin.balance)}</span>
            <span className="right ">{floatText(coin.formatedPercent)}</span>
          </React.Fragment>
        ))}
      </Grid>
    </div>
  );
};

export default React.memo(({ isActive, onClose, runningData: { id, symbol }, mode }) => {
  const open = useSelector((state) => state.smarttrade.open.items, shallowEqual);
  const CurrentLoading = useSelector((state) => state.smarttrade.CurrentLoading);
  const dispatch = useDispatch();
  const fresh = useCallback(() => {
    dispatch({
      type: 'smarttrade/getOpenOrders',
      payload: {
        taskId: id,
        symbolCode: symbol,
      },
    });
  }, []);
  useTicker(fresh, 'immediately', null, isActive);
  const isRTL = useIsRTL();
  if (CurrentLoading) return null;
  return (
    <div hidden={!isActive}>
      <Hold open={open} />
      {isRTL ? '' : <Profits taskId={id} open={open} />}
      <AssetSnapshots snapshots={open.snapshots} />
    </div>
  );
});
