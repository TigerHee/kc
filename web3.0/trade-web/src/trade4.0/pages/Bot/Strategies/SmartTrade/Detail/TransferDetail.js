/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import DialogRef from 'Bot/components/Common/DialogRef';
import { fundTransfers } from 'SmartTrade/services';
import { getSymbolInfo, getCurrencyName } from 'Bot/hooks/useSpotSymbolInfo';
import { localDateTimeFormat, floatToPercent, formatNumber } from 'Bot/helper';
import Empty from '@mui/Empty';
import _ from 'lodash';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text, Flex } from 'Bot/components/Widgets';
import { Spin } from '@kux/mui';

const uDecimal = 3;
const getPrecision = (currency) => {
  if (currency === 'USDT') {
    return {
      pricePrecision: uDecimal,
      basePrecision: uDecimal,
    };
  }
  return getSymbolInfo(`${currency}-USDT`);
};
// 判断减仓是否成功
const isReduceSucc = (item) => {
  return item.updateType === 'REDUCE_INVESTMENTS' && !_.isEmpty(item.reduces);
};

const TransferTypeInfo = {
  // 加仓
  ADD_INVESTMENTS: {
    icon: 'deposit',
    title: () => 'smart.transintosucss',
    subTitle: ['smart.transferbefore', 'smart.transferafter'],
  },
  // 没用
  REMOVE_INVESTMENTS: {
    icon: 'withdraw',
    title: () => 'smart.transoutsucss',
    subTitle: ['outafter', 'outbefore'],
  },
  // 减仓
  REDUCE_INVESTMENTS: {
    icon: 'withdraw',
    title: (isSuccess) => (isSuccess ? 'outsucc' : 'fAmDKChrsDDMThR6GYUJ6h'),
    subTitle: ['outafter', 'outbefore'],
  },
  // 交易对下架
  DELIST_SYMBOL: {
    icon: 'withdraw',
    title: () => 'symboloffline',
    subTitle: ['outafter', 'outbefore'],
  },
};

const Transfer = styled.div`
  .table-row {
    color: ${({ theme }) => theme.colors.text40};
    display: flex;
    > span:first-child {
      flex-basis: 20%;
      overflow: hidden;
    }
    > span:nth-child(2) {
      flex-basis: 40%;
      padding-right: 4px;
      padding-left: 4px;
      word-wrap: break-word;
      word-break: break-all;
    }
    > span:nth-child(3) {
      flex-basis: 40%;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
`;
const Block = styled.div`
  background-color: ${({ theme }) => theme.colors.cover4};
  border-radius: 4px;
  margin-bottom: 12px;
  padding: 12px 16px;
  font-size: 14px;
`;
const TransferDetail = ({ botTaskId }) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fundTransfers(botTaskId)
      .then(({ data }) => {
        setLists(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [botTaskId]);

  if (loading) {
    return <Spin style={{ height: 260, width: '100%' }} size="small" />;
  }
  if (!loading && lists.length === 0) {
    return (
      <div style={{ height: 260 }}>
        <Empty />
      </div>
    );
  }
  return (
    <Transfer>
      {lists.map((item) => {
        const info = TransferTypeInfo[item.updateType];
        if (!info || !item.oldOverview || !item.newOverview) return null;

        const uniqCoins = [];
        const oldCoinsInfo = {};
        const newCoinsInfo = {};
        const has = {};

        const oldCoins = item.oldOverview?.snapshots || [];
        const newCoins = item.newOverview?.snapshots || [];

        newCoins.forEach((bar) => {
          newCoinsInfo[bar.currency] = bar;
          if (!has[bar.currency]) {
            uniqCoins.push(bar.currency);
          }
          has[bar.currency] = true;
        });

        oldCoins.forEach((foo) => {
          oldCoinsInfo[foo.currency] = foo;
          if (!has[foo.currency]) {
            uniqCoins.push(foo.currency);
          }
          has[foo.currency] = true;
        });
        const isSuccess = isReduceSucc(item);
        return (
          <Block key={item.code} className="table-block">
            <Flex vc sb fs={12} className="capitalize">
              <Text color="text">{_t(info.title(isSuccess))}</Text>
              <Text type="text40">{localDateTimeFormat(item.newOverview.time)}</Text>
            </Flex>
            <div className="table-head table-row">
              <span className="left">{_t('smart.coin')}</span>
              <span className="right">{_t(info.subTitle[0])}</span>
              <span className="right">{_t(info.subTitle[1])}</span>
            </div>
            <div>
              {uniqCoins.map((coin) => {
                const afterInfo = newCoinsInfo[coin] || {};
                const beforeInfo = oldCoinsInfo[coin] || {};
                const { basePrecision } = getPrecision(coin);
                return (
                  <div key={coin} className="table-row mb-4">
                    <span>{getCurrencyName(coin)}</span>
                    <span className="right">
                      <span>
                        {beforeInfo.balance
                          ? formatNumber(beforeInfo.balance || '0', basePrecision)
                          : 0}
                      </span>

                      <span>
                        &nbsp;({beforeInfo.percent ? floatToPercent(beforeInfo.percent) : '0%'})
                      </span>
                    </span>
                    <span className="right">
                      <span>
                        {afterInfo.balance
                          ? formatNumber(afterInfo.balance || '0', basePrecision)
                          : 0}
                      </span>
                      <span>
                        &nbsp;({afterInfo.percent ? floatToPercent(afterInfo.percent) : '0%'})
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </Block>
        );
      })}
    </Transfer>
  );
};

export default ({ dialogRef }) => {
  return (
    <DialogRef
      cancelText={null}
      okText={null}
      onCancel={() => dialogRef.current.toggle()}
      ref={dialogRef}
      title={_t('smart.transfersrecord')}
      size="large"
      maskClosable
    >
      <TransferDetail />
    </DialogRef>
  );
};
