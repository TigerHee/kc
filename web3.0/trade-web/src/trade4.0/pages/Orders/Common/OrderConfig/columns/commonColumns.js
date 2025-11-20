/*
 * @Author: harry.lai harry.lai@kupotech.com
 * @Date: 2024-05-13 10:29:59
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-05-14 12:46:27
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/Common/OrderConfig/columns/commonColumns.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * Owner: jessie@kupotech.com
 */

import React, { Fragment } from 'react';
import { includes } from 'lodash';
import { css, cx } from '@emotion/css';
import { ICQuestionOutlined, ICEyeCloseOutlined } from '@kux/icons';
import Tooltip from '@mui/Tooltip';
import { showDatetime } from 'helper';
import { _t } from 'utils/lang';
import { trackClick } from 'utils/ga';

import SymbolCodeToName from '@/components/SymbolCodeToName';
import SymbolPrecision from '@/components/SymbolPrecision';
import CoinCodeToName from '@/components/CoinCodeToName';
import SvgComponent from '@/components/SvgComponent';
import {
  DatetimeText,
  SymbolNameText,
  SideText,
  TypeText,
  NumFormat,
  MiniSymbolNameWrapper,
  CancelOperatorTitle,
  CancelOperatorButton,
  DashedText,
  FeeContent,
} from '../../style';
import TwapProcessTip from '../../OrderListCommon/TwapProcessTip';
import { genSelect, numTooltip, ocoLimitPrice, tsoTriggerPriceRender } from '../nodeHelper';
import { directions, statusList, stopMark, types } from '../constants';
import EnhanceIndiaComplianceTipWrap from '../../OrderListCommon/EnhanceIndiaComplianceTipWrap';
import { twapMiniSymbolTopCss } from './style';
// -----------------------------  table list columns start ---------------------------
const c_time = ({ label, key }) => {
  if (!label) {
    label = _t('orders.c.time');
  }
  return {
    key,
    dataIndex: key,
    title: label,
    render(record) {
      return <DatetimeText>{showDatetime(record)}</DatetimeText>;
    },
  };
};

const c_symbol = (routeToSymbol, moduleName = 'openOrder') => ({
  key: 'symbol',
  dataIndex: 'symbol',
  title: _t('orders.col.symbol'),
  render(record, records) {
    return (
      <section className="flex-center" style={{ height: '100%' }}>
        <TwapProcessTip {...records} moduleName={moduleName} />
        {routeToSymbol ? (
          <SymbolNameText
            onClick={(e) => {
              e.stopPropagation();
              trackClick([moduleName, 'lineTradePair']);
              routeToSymbol(record);
            }}
            dir="ltr"
          >
            <SymbolCodeToName code={record} />
            <SvgComponent
              type="arrow-right"
              fileName="orders"
              size={8}
              className="arrow-right-icon"
            />
          </SymbolNameText>
        ) : (
          <SymbolNameText dir="ltr">
            <SymbolCodeToName code={record} />
          </SymbolNameText>
        )}
      </section>
    );
  },
});

const c_type = (typeOptions, value, onChange, sensorKey, sensorType) => {
  return {
    key: 'type',
    dataIndex: 'type',
    isSelect: true,
    title: genSelect({ value, key: 'type', onChange, options: typeOptions, sensorKey, sensorType }),
    render(record, records) {
      const { hidden, iceberg, displayType } = records;
      const typeTemp = types.find((item) => (displayType || record) === item.value);
      return (
        <TypeText>
          {typeTemp && typeTemp.text()}
          {hidden || iceberg ? (
            <span className="icon">
              <Tooltip size="small" title={_t('orders.c.hidden')} placement="top">
                <ICEyeCloseOutlined />
              </Tooltip>
            </span>
          ) : null}
        </TypeText>
      );
    },
  };
};

const c_side = (value, onChange, sensorKey, sensorType) => ({
  key: 'side',
  dataIndex: 'side',
  isSelect: true,
  title: genSelect({ value, key: 'side', onChange, options: directions, sensorKey, sensorType }),
  render(record) {
    const sideTemp = directions.find(
      (dir) => dir.value.toUpperCase() === (record || '').toUpperCase(),
    );
    return <SideText side={(record || '').toUpperCase()}>{sideTemp && sideTemp.text()}</SideText>;
  },
});

/**
 * e_l_o: 限价止盈OCO订单
 * e_s_o: 触价价止盈OCO订单
 * l_l_o: 限价止损OCO订单
 * l_s_o: 触价止损OCO订单
 */
const c_price = ({ key, label }) => ({
  key,
  dataIndex: key,
  title: label,
  render(record, records) {
    const { symbol } = records;
    const unit = symbol.split('-')[1];
    if (!record) {
      return '-';
    }
    const content = (
      <Fragment>
        <SymbolPrecision symbol={symbol} value={record} precisionKey="pricePrecision" />
        {key === 'price' && ocoLimitPrice(records)}
      </Fragment>
    );
    return numTooltip({ coin: unit, content });
  },
});

const c_funds = () => ({
  key: 'funds',
  title: _t('orders.c.funds'),
  dataIndex: 'funds',
  render(record, records) {
    const { symbol } = records;
    const unit = symbol.split('-')[1];
    const content = (
      <SymbolPrecision symbol={symbol} value={record} precisionKey="pricePrecision" />
    );
    return numTooltip({ coin: unit, content });
  },
});

const c_trigger_price = ({ tipContainer, orderType } = {}) => ({
  key: 'stopPrice',
  dataIndex: 'stopPrice',
  title: _t('orders.c.trigger'),
  render(record, records) {
    const { symbol, stop, stopType, limitPrice, ocoTriggerType } = records;
    const isHistoryOrder = orderType === 'history'; // 仅对订单历史有效
    const isAdvancedOrder = orderType === 'orderStop'; // 高级委托
    let type = stop || stopType;
    const unit = symbol.split('-')[1];
    if (!type || !record) {
      return '-';
    }
    if (type === 'tso') {
      return tsoTriggerPriceRender(records, {
        tipContainer,
        showTip: isAdvancedOrder,
      });
    }
    // 是否为历史订单
    if (isHistoryOrder) {
      if (includes(['e_l_o', 'l_l_o'], ocoTriggerType)) {
        // 是否是限价单
        return '-';
      } else if (includes(['e_s_o', 'l_s_o'], ocoTriggerType) && !limitPrice) {
        // limitPrice 判断是否是高级委托取消 !limitPrice 是否是当前委托
        type = ocoTriggerType === 'l_s_o' ? 'loss' : 'entry';
      }
    }
    const content = (
      <Fragment>
        {stopMark[type]}
        <SymbolPrecision stopMark symbol={symbol} value={record} precisionKey="pricePrecision" />
      </Fragment>
    );
    return numTooltip({ coin: unit, content });
  },
});

const c_amount = ({ key, label, viewDetail }) => ({
  key,
  dataIndex: key,
  title: label,
  render(record, records) {
    const { id, symbol } = records;
    const unit = symbol.split('-')[0];
    const content = viewDetail ? (
      <DashedText
        onClick={() => {
          viewDetail(id, false, symbol);
        }}
      >
        <SymbolPrecision symbol={symbol} value={record} precisionKey="basePrecision" />
      </DashedText>
    ) : (
      <SymbolPrecision symbol={symbol} value={record} precisionKey="basePrecision" />
    );
    return numTooltip({ coin: unit, content });
  },
});

const c_amount_stop = () => ({
  key: 'totalSize',
  dataIndex: 'totalSize',
  title: _t('orders.c.total.size'),
  render(record, records) {
    const { symbol, type, totalFunds } = records;
    const [baseCoin, quoteCoin] = symbol.split('-');
    const isTotalFunds =
      // type === 'market' && totalFunds >= record;
      (type === 'market' || type === 'market_stop') && +totalFunds >= +record;
    const unit = isTotalFunds ? quoteCoin : baseCoin;
    const amount = isTotalFunds ? totalFunds : record;
    const precisionKey = isTotalFunds ? 'quotePrecision' : 'basePrecision';
    const content = <SymbolPrecision symbol={symbol} value={amount} precisionKey={precisionKey} />;
    return numTooltip({ coin: unit, content });
  },
});

const c_amount_history = () => ({
  key: 'size',
  title: _t('orders.c.total.size'),
  render(record, records) {
    const { symbol, type, size, funds } = records;
    const isFunds = (type === 'market' || type === 'market_stop') && +funds >= +size;
    const unit = isFunds ? symbol.split('-')[1] : symbol.split('-')[0];
    const value = isFunds ? funds : size;
    const precisionKey = isFunds ? 'quotePrecision' : 'basePrecision';
    const content = <SymbolPrecision symbol={symbol} value={value} precisionKey={precisionKey} />;
    return numTooltip({ coin: unit, content });
  },
});

const c_amount_history_traded = ({ viewDetail }) => ({
  // 历史委托已成交量
  key: 'dealSize',
  title: _t('orders.c.deal.size'),
  dataIndex: 'dealSize',
  render(record, records) {
    const { id, symbol, type, dealFunds, dealSize, funds, size, displayType } = records;
    const isFunds = (type === 'market' || type === 'market_stop') && +funds >= +size;
    const unit = isFunds ? symbol.split('-')[1] : symbol.split('-')[0];
    const value = isFunds ? dealFunds : dealSize;
    const precisionKey = isFunds ? 'quotePrecision' : 'basePrecision';
    const isStop = includes(displayType, 'stop');

    const content =
      +value > 0 ? (
        <DashedText
          onClick={() => {
            viewDetail(id, isStop, symbol);
          }}
        >
          <SymbolPrecision symbol={symbol} value={value} precisionKey={precisionKey} />
        </DashedText>
      ) : (
        <SymbolPrecision symbol={symbol} value={value} precisionKey={precisionKey} />
      );
    return numTooltip({ coin: unit, content });
  },
});

const c_fee = ({ onClick }) => ({
  key: 'fee',
  title: _t('orders.c.fee'),
  dataIndex: 'fee',
  render(record, records) {
    const { feeCurrency, symbol, tax, taxRate, taxCurrency } = records;
    const normalFee = (
      <NumFormat className="kflex kfe">
        <span>
          <DashedText onClick={() => onClick(records)}>
            <SymbolPrecision symbol={symbol} coin={feeCurrency} value={record} />
          </DashedText>
        </span>
        <span className="coinName">
          <CoinCodeToName coin={feeCurrency} />
        </span>
      </NumFormat>
    );

    return tax ? (
      <FeeContent>
        {normalFee}
        {/* 展示税费 */}
        <NumFormat className="kflex kfe">
          <div className="kflex kvc">
            <EnhanceIndiaComplianceTipWrap taxRate={taxRate}>
              <SymbolPrecision symbol={symbol} coin={taxCurrency} value={tax} />
            </EnhanceIndiaComplianceTipWrap>
          </div>
          <div className="kflex coinName">
            <CoinCodeToName coin={taxCurrency} />
          </div>
        </NumFormat>
      </FeeContent>
    ) : (
      normalFee
    );
  },
});

const c_status = ({ value, onChange, sensorKey, sensorType }) => ({
  key: 'status',
  isSelect: true,
  title: genSelect({
    value,
    key: 'cancelExist',
    onChange,
    options: statusList,
    sensorKey,
    sensorType,
  }),
  render(record, records) {
    const { cancelExist, dealSize, priceLimitTrigger } = records;
    const statusStr =
      cancelExist && dealSize <= 0 ? _t('orders.c.status.cancel') : _t('orders.c.status.done');
    if (priceLimitTrigger) {
      return (
        <Tooltip size="small" title={_t('trade.price.limit.tip')} placement="top">
          <DashedText>{statusStr}</DashedText>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip size="small" title={statusStr} placement="top">
          <span>{statusStr}</span>
        </Tooltip>
      );
    }
  },
});

const c_cancel_operator = ({ onCancelAll, onCancel, config = {} }) => {
  const { isDisableCancel, disabledAllCancel = false } = config || {};
  return {
    key: 'operator',
    dataIndex: 'operator',
    title: (
      <CancelOperatorTitle>
        <a onClick={disabledAllCancel ? undefined : onCancelAll} disabled={disabledAllCancel}>
          {_t('orders.c.cancel.multi')}
        </a>
        <Tooltip size="small" placement="top" title={_t('9JKe8WzurtuqacyVdAKcQK')}>
          <ICQuestionOutlined size={12} />
        </Tooltip>
      </CancelOperatorTitle>
    ),
    render(record, records) {
      const disabled =
        typeof isDisableCancel === 'function' ? isDisableCancel(records && records.symbol) : false;
      return (
        <span>
          <CancelOperatorButton
            onClick={
              disabled
                ? undefined
                : () => {
                    onCancel(records);
                  }
            }
            disabled={disabled}
          >
            {_t('orders.c.cancel')}
          </CancelOperatorButton>
        </span>
      );
    },
  };
};
// -----------------------------  table list columns end ---------------------------

// -----------------------------  card list columns start ---------------------------
const c_symbol_mini = (
  config,
  screen,
  className,
  routeToSymbol,
  moduleName = 'openOrder',
  options = {},
) => ({
  key: 'symbol',
  dataIndex: 'symbol',
  render(record, records) {
    const { timeKey, operator, describe } = config || {};
    const { hidden, iceberg, displayType, side, type } = records;
    const { hiddenTypeText = false, isTwapStyle = false } = options;
    const sideTemp = directions.find(
      (dir) => dir.value.toUpperCase() === (side || '').toUpperCase(),
    );
    const typeTemp = types.find((item) => (displayType || type) === item.value);

    let operatorComp = '';
    if (operator?.render) {
      operatorComp = operator.render(record, records);
    } else if (describe?.render) {
      operatorComp = describe.render(record, records);
    }
    return (
      <MiniSymbolNameWrapper
        className={cx(
          `${className} ${screen === 'md' || screen === 'sm' ? 'miniScreen' : ''}`,
          isTwapStyle &&
            css`
              ${twapMiniSymbolTopCss}
            `,
        )}
      >
        <div className="left">
          <div className="top">
            {routeToSymbol ? (
              <section className="flex-center" style={{ height: '100%' }}>
                <TwapProcessTip {...records} moduleName={moduleName} />

                <SymbolNameText
                  screen="miniScreen"
                  onClick={() => {
                    trackClick([moduleName, 'lineTradePair']);
                    routeToSymbol(record);
                  }}
                  dir="ltr"
                >
                  <SymbolCodeToName code={record} />
                  <SvgComponent
                    type="arrow-right"
                    fileName="orders"
                    size={8}
                    className="arrow-right-icon"
                  />
                </SymbolNameText>
              </section>
            ) : (
              <SymbolNameText dir="ltr">
                <SymbolCodeToName code={record} />
              </SymbolNameText>
            )}
          </div>
          <div className="bottom">
            <span className="sideWrapper">
              <SideText side={(side || '').toUpperCase()}>{sideTemp && sideTemp.text()}</SideText>
              {!hiddenTypeText && (
                <>
                  <SideText side={(side || '').toUpperCase()}>/</SideText>
                  <SideText side={(side || '').toUpperCase()}>
                    {typeTemp && typeTemp.text()}
                    {hidden || iceberg ? (
                      <span className="ml-6">
                        <Tooltip size="small" title={_t('orders.c.hidden')} placement="top">
                          <ICEyeCloseOutlined />
                        </Tooltip>
                      </span>
                    ) : null}
                  </SideText>
                </>
              )}
            </span>

            {timeKey && records[timeKey] ? (
              <span className="time">{showDatetime(records[timeKey])}</span>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="operator">{operatorComp}</div>
      </MiniSymbolNameWrapper>
    );
  },
});
// -----------------------------  card list columns end ---------------------------

export {
  c_time,
  c_symbol,
  c_type,
  c_side,
  c_price,
  c_funds,
  c_trigger_price,
  c_amount,
  c_amount_stop,
  c_amount_history,
  c_amount_history_traded,
  c_fee,
  c_status,
  c_cancel_operator,
  c_symbol_mini,
};
