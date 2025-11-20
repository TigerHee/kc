/**
 * @Owner: borden@kupotech.com
 * @Date: 2021-05-16 16:35:42
 * @Description: 借币/还币相关配置
 */
import React from 'react';
import { camelCase } from 'lodash';
import Button from '@mui/Button';
import sentry from '@kc/sentry';
import CoinCodeToName from '@/components/CoinCodeToName';
import { _t } from 'utils/lang';
import { sub, dropZero, normalizeNumber, getPrecisionFromIncrement } from 'helper';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';

// 杠杆计息精度
export const INTEREST_PRECISION = 8;

export const MODAL_TYPE = [
  {
    key: 'borrow',
    label: () => _t('margin.borrow'),
    showAmountUtil: true,
    showCurrencyDesc: true,
    getMax: ({ borrowSize }) => borrowSize,
    amountExtraTitle: () => _t('margin.can.borrow'),
    amountPlaceholder: () => '',
    postEffect: tradeType => TRADE_TYPES_CONFIG[tradeType].postBorrowEffect,
    getOkBtnGaFunc: (sensorFunc) => {
      sensorFunc(['borrowRepayWindow', 'borrowConfirm', 'click']);
    },
    getOkBtnExposeFunc: (sensorFunc) => {
      sensorFunc(['borrowRepayWindow', 'borrowConfirm', 'expose']);
    },
    defaultParams: {
      channel: 'WEB',
      period: '7,14,28',
      borrowStrategy: 'FOK',
    },
    postCallback: ({ data, size, currentCurrencyName }, message) => {
      data.actualSize = +data.actualSize;
      if (data.actualSize === +size) {
        message.success(_t('margin.borrow.order.filled', {
            number: data.actualSize,
            coin: currentCurrencyName,
          }));
      } else if (data.actualSize > 0) {
        message.success(_t('margin.borrow.ioc.filled', {
            number: data.actualSize,
            coin: currentCurrencyName,
          }));
      } else {
        message.info(_t('margin.borrow.koc.cancled'));
      }
    },
    getAmountInputAddonAfter: currentCurrency => (<CoinCodeToName coin={currentCurrency} />),
    validatorFunc: ({
      max,
      value,
      borrowMaxAmount,
      borrowMinAmount,
      currencyLoanMinUnit,
    }) => {
      const borrowMaxNum = +borrowMaxAmount;
      const borrowMinNum = +borrowMinAmount;
      const realMax = borrowMaxNum > max ? max : borrowMaxNum;
      if (value > realMax) {
        return Promise.reject(`${_t('margin.borrow.max.amount')}${realMax}`);
      }
      if (value < borrowMinNum) {
        return Promise.reject(`${_t('margin.borrow.min.amount')}${borrowMinNum}`);
      }
      const valuePercision = getPrecisionFromIncrement(value);
      const currencyPercision = getPrecisionFromIncrement(currencyLoanMinUnit);
      if (valuePercision > currencyPercision) {
        return Promise.reject(`${_t('margin.amount.precision.tip')}${currencyLoanMinUnit}`);
      }
      return Promise.resolve();
    },
  },
  {
    key: 'repay',
    // showRuleField: true,
    label: () => _t('margin.repay.coin'),
    // 计息是固定的8位精度，所以还款也就是固定的8位，所以这里将可用处理成8位，方便快捷填入
    getMax: ({ availableBalance }) => normalizeNumber(availableBalance || 0, INTEREST_PRECISION),
    amountExtraTitle: () => _t('margin.avaliable'),
    amountPlaceholder: liability => `${_t('n.trade.margin.repay.place')}：${liability}`,
    postEffect: tradeType => TRADE_TYPES_CONFIG[tradeType].postRepayEffect,
    getOkBtnGaFunc: (sensorFunc) => {
      sensorFunc(['borrowRepayWindow', 'repayConfirm', 'click']);
    },
    getOkBtnExposeFunc: (sensorFunc) => {
      sensorFunc(['borrowRepayWindow', 'repayConfirm', 'expose']);
    },
    defaultParams: {
      channel: 'WEB',
    },
    postCallback: ({ size, liability, currentCurrencyName }, message) => {
      let leftoverLiability = dropZero(sub(liability, size));
      if (+leftoverLiability < 0) leftoverLiability = 0;
      message.success(_t('margin.repay.successTip', {
          currency: currentCurrencyName,
          num: `${leftoverLiability}`,
        }));
    },
    getAmountInputAddonAfter: (currentCurrency, onClick) => (
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <CoinCodeToName coin={currentCurrency} />
        <Button
          variant="text"
          type="brandGreen"
          onClick={onClick}
          style={{ minWidth: 'unset', padding: '0 8px', whiteSpace: 'nowrap' }}
        >{_t('all')}</Button>
      </div>
    ),
    validatorFunc: ({ max, value }) => {
      if (value > max) {
        return Promise.reject(_t('margin.amount.not.enough'));
      }
      // if (value > liability) {
      //   callback(_t('margin.repay.amount.exceed'));
      //   return;
      // }
      const valuePercision = getPrecisionFromIncrement(value);
      // 计息是固定的8位精度，所以还款也就是固定的8位
      if (valuePercision > INTEREST_PRECISION) {
        return Promise.reject(`${_t('margin.amount.precision.tip')}${INTEREST_PRECISION}`);
      }
      return Promise.resolve();
    },
    sentryFunc: ({ error, tradeType, payload }) => {
      const fatalType = camelCase(`${tradeType}_repay`);
      // 添加一条面包屑，随report记录一起上报sentry平台
      if (window.SentryLazy?.addBreadcrumb) {
        window.SentryLazy.addBreadcrumb({
          type: 'info',
          level: 'fatal',
          category: 'message',
          message: JSON.stringify(payload),
        });
      }
      try {
        sentry.captureEvent({
          level: 'fatal',
          biz: sentry.bizType.spot,
          message: `${fatalType}-failed: ${error?.msg || '-'}`,
          tags: {
            fatal_type: fatalType,
          },
        });
      } catch (err) {
        console.error(err);
      }
    },
  },
];
