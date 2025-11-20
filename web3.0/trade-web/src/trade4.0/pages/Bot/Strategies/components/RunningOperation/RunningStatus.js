/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { _t, _tHTML } from 'Bot/utils/lang';
import ReturnAsset from '../ReturnAsset';
import { formatNumber, showDateTimeByZone } from 'Bot/helper';

// 状态配置
export function getStopInfo(props, symbolInfo = {}) {
  const { base, quota, pricePrecision } = symbolInfo;
  const config = {
    // 划转失败
    TRANSFER_FAIL: {
      text: _t('card21'),
    },
    // 启动失败
    START_FAILED: {
      text: _t('card21'),
    },
    // 用户地区限制
    USER_RESTRICTED: {
      text: _t('forcestop'),
      content: _tHTML('forcestophint'),
    },
    // 交易对下线
    SYMBOL_OFFLINE: {
      text: _t('symboloffline'),
      content: (
        <React.Fragment>
          <div>{_tHTML('clsgrid.backbibi')}</div>
          <div>
            <ReturnAsset transferDetails={props.transferDetails} />
          </div>
        </React.Fragment>
      ),
    },
    // 止损
    LOSS_STOP: {
      text: _t('clsgrid.hasendstopprice'),
      content: (
        <React.Fragment>
          <div>
            {_t('gridform21')}: {formatNumber(props.stopLossPrice, pricePrecision)}&nbsp;{quota}
          </div>
          <div>{_tHTML('clsgrid.backbibi')}</div>
          <div>
            <ReturnAsset transferDetails={props.transferDetails} />
          </div>
        </React.Fragment>
      ),
    },
    // 止盈价格
    PROFIT_STOP: {
      text: _t('hasendstopprofitprice'),
      content: (
        <React.Fragment>
          <div>
            {_t('stopprofit')}: {formatNumber(props.stopProfitPrice, pricePrecision)} {quota}
          </div>
          <div>{_tHTML('clsgrid.backbibi')}</div>
          <div>
            <ReturnAsset transferDetails={props.transferDetails} />
          </div>
        </React.Fragment>
      ),
    },
    // 等待触发开单价
    WAIT_OPEN_UNIT_PRICE: {
      text: _t('clsgrid.openpricenotok'),
      content: (
        <div>
          {_t('openprice')}: {formatNumber(props.openUnitPrice, pricePrecision)}
          &nbsp;
          {quota}
        </div>
      ),
    },
    // 暂停
    PAUSED: {
      text: _t('dyhhhLMCGQYLkRzmoHT55c'),
      content: _tHTML('jKiC3UEsXKM3ANVgyr4shd', {
        base,
        quota: ` ${quota}`,
        price: formatNumber(props.basePrice, pricePrecision),
      }),
      isRunningMode: true, // 是否当作运行中处理
    },
    // 合约风险限额
    RISK_PROTECTION: {
      text: _t('risklimitprotection'),
      content: _tHTML('futrgrid.riskhint2', {
        date: showDateTimeByZone(props.riskLimitTime),
      }),
    },
    // 合约爆仓
    LIQUIDATED: {
      text: _t('futrgrid.blowup'),
      content: (
        <div>
          {_t('futrgrid.blowuppricenow')}: {formatNumber(props.blowUpPrice, pricePrecision)}&nbsp;
          {quota}
        </div>
      ),
    },
    // 定投投资钱不够, 前端自定义类型
    DCA_MONEY_ENOUGH: {
      text: _t('89VYabi2U2yKgPAiVQgGyP'),
      content: <div>{_tHTML('wGZ9NFuEVuAd7X1Z7bnoZi')}</div>,
      isRunningMode: true, // 是否当作运行中处理
    },
    // 定投投资额度不够, 前端自定义类型
    DCA_INVERST_VOL_NOT_ENOUGH: {
      text: _t('8eFkXF61799TaqwHUR3WjE'),
      content: <div>{_tHTML('tFDnb36JE5ajfmiytz274J')}</div>,
      isRunningMode: true, // 是否当作运行中处理
    },
    // 前端自定义类型
    OUT_OF_PRICE_RANGE: {
      text: _t('dtEgKaQepwSt1AmTABN1cb'),
      content: _t('priceoutofrange'),
      isRunningMode: true, // 是否当作运行中处理
    },
    // 前端自定义类型: 合约部分平仓
    PART_LIQUIDATED: {
      text: _t('partsoldhint'),
      content: _t('partsold'),
    },
    // 交易对信息改变
    SYMBOL_INFO_CHANGE: {
      text: _t('symbolinfochangetitle'),
      content: _t('symbolinfochange'),
      isRunningMode: true, // 是否当作运行中处理, 可查看订单详情
    },
  };
  return config[props.status];
}
