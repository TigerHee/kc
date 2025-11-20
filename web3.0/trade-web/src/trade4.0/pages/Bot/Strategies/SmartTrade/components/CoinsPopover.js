/**
 * Owner: mike@kupotech.com
 */
import React, { useRef } from 'react';
import Button from '@kux/mui/Button';
import Popover from 'Bot/components/Common/Popover';
import { FormatNumber, Profit, ChangeRate } from 'Bot/components/ColorText';
// import { ShowSpotKlineBySymbol } from 'Common/SymbolPrice';
import { handleSortPercent } from '../util';
import { formatEffectiveDecimal, floatToPercent } from 'Bot/helper';
import { styled } from '@kux/mui/emotion';
// import BotIcon from 'components/common/BotIcon';
import { filterTargets } from '../config';
import { getSymbolInfo } from 'Bot/hooks/useSpotSymbolInfo';
import { Text, Flex } from 'Bot/components/Widgets';
import Decimal from 'decimal.js';
import { _t, _tHTML } from 'Bot/utils/lang';

const Table = styled.div`
  font-size: 12px;
  color: #fff;
  span[color='text60'] {
    color: #fff;
  }
  .ctable-hd {
    .ctable-td {
      padding-right: 4px;
      overflow: hidden;
      white-space: nowrap;
      text-align: right;
      &:first-child {
        text-align: left;
      }
      &:last-child {
        padding-right: 0;
      }
    }
  }
  .ctable-td1 {
    flex: 22% 1 0;
    max-width: 22%;
  }
  .ctable-td2 {
    flex: 29% 1 0;
    max-width: 29%;
  }
  .ctable-td3 {
    flex: 29% 1 0;
    max-width: 29%;
  }
  .ctable-td4 {
    flex: 20% 1 0;
    max-width: 20%;
  }
  .coin-name {
    min-width: 30px;
    max-width: 120px;
  }
`;
const PopoverBox = styled(Popover)`
  .rootPopover {
    width: 360px !important;
    .contentPopover {
      padding: 14px 12px !important;
    }
  }
`;
const uDecimal = 3;
/**
 * @description: 计算U的价值
 * @param {*} coin
 * @return {*}
 */
const calcWorthU = (coin) => {
  let worthU;
  if (coin.currency === 'USDT') {
    coin.price = 1;
    coin.avgPrice = 1;
    worthU = formatEffectiveDecimal(coin.balance, uDecimal, false);
  } else if (coin.price && coin.balance) {
    worthU = Decimal(coin.price)
      .times(coin.balance)
      .toFixed(8, Decimal.ROUND_DOWN);
    worthU = formatEffectiveDecimal(worthU, uDecimal, false);
  }
  return worthU;
};
/**
 * @description: 币种table显示头部
 * @return {*}
 */
const TableHead = () => {
  return (
    <Text className="Flex ctable-hd fs-12 mb-12">
      <div className="ctable-td ctable-td1 ">
        <span>{_t('smart.coin')}</span>
        <div>{_t('gridwidget14')}</div>
      </div>
      <div className="ctable-td  ctable-td2">
        <span>{_t('qprJViWF66hNQNZ9vAzSkk')}</span>
        <div>{_t('profit')}</div>
      </div>
      <div className="ctable-td  ctable-td3">
        <span>{_t('robotparams12')}</span>
        <div>{_t('auto.commonprice')}</div>
      </div>

      <div className="ctable-td  ctable-td4">
        <span>{_t('f22hod45tZFHDingfx144X')}</span>
        <div>{_t('7zMrGUQJAXkhDQvZxrjBgC')}</div>
      </div>
    </Text>
  );
};
/**
 * @description:  币种table显示主体
 * @param {*} currencyInfo
 * @return {*}
 */
const TableBody = ({ currencyInfo = [] }) => {
  currencyInfo = handleSortPercent(currencyInfo || []);

  return (
    <React.Fragment>
      {currencyInfo.map((coin, index) => {
        const symbolCode = `${coin.currency}-USDT`;
        const worthU = calcWorthU(coin);
        const { pricePrecision, base } = getSymbolInfo(symbolCode);
        return (
          <div className="Flex ctable-row ctable-hd mb-18" key={coin.currency}>
            <div className="ctable-td ctable-td1">
              <div className="fw500 coin-name ellipsisx">{base}</div>
              {coin.currency !== 'USDT' && (
                // <ShowSpotKlineBySymbol symbolCode={coin.currency}>
                <ChangeRate value={coin.changeRate} />
                // </ShowSpotKlineBySymbol>
              )}
            </div>

            <div className="ctable-td  ctable-td2 wordwrap">
              <div>{worthU || '--'}</div>
              <Profit
                value={coin.currencyProfit}
                empty="--"
                className="fs-12"
              />
            </div>

            <div className="ctable-td  ctable-td3 wordwrap">
              <div>
                <FormatNumber value={coin.price} precision={pricePrecision} />
              </div>
              <span>
                <FormatNumber
                  value={coin.avgPrice}
                  precision={pricePrecision}
                />
              </span>
            </div>

            <div className="ctable-td  ctable-td4 wordwrap">
              <div>{coin?.target?.percent ? floatToPercent(coin?.target?.percent) : '--'}</div>
              <span className="color-secondary fs-12">
                {coin.percent ? floatToPercent(coin.percent) : '--'}
              </span>
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
};

/**
 * @description:
 * @param {*} item
 * @param {Function} onTriggerUpdatePosition  控制打开修改持仓弹窗函数
 * @return {*}
 */
const CoinsTable = ({ item, onTriggerUpdatePosition }) => {
  // const propData = {
  //   taskId: item.id,
  //   targets: filterTargets(item.currencyInfo),
  //   snapshots: item.snapshots,
  //   method: item.method,
  //   totalInvestmentUsdt: item.totalCost,
  // };
  return (
    <Table>
      <TableHead />
      <TableBody currencyInfo={item.currencyInfo} />
      {/* {item.status === 'RUNNING' && (
        <Text type="text60" className="Flex fe">
          <Button
            type="default"
            size="small"
            style={{ fontSize: '12px' }}
            className="fs-12"
            onClick={() => onTriggerUpdatePosition({ options: propData })}
          >
            <BotIcon id="rebalance-update" className="mr-4" />
            {_t('smart.updatehold')}
          </Button>
        </Text>
      )} */}
    </Table>
  );
};
/**
 * @description: hover币种显示币种价格盈亏信息table
 * @param {*} children
 * @param {*} item
 * @param {*} onTriggerUpdatePosition 控制打开修改持仓弹窗函数
 * @return {*}
 */
const CoinsPopover = ({ children, item, onTriggerUpdatePosition }) => {
  return (
    <PopoverBox
      placement="top-start"
      enterDelay={2000}
      contentClass="contentPopover"
      rootClass="rootPopover"
      content={
        <CoinsTable
          item={item}
          onTriggerUpdatePosition={onTriggerUpdatePosition}
        />
      }
    >
      {children}
    </PopoverBox>
  );
};

export default CoinsPopover;
